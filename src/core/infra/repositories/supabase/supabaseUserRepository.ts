import {
  IUserRepository,
  AuthCredentials,
  SignUpPayload,
  UpdateUserPayload,
} from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { Name } from '../../../domain/value-objects/Name';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';
import { supabase } from '../../supabase/client/supabaseClient';
import type { User as SupabaseAuthUser, PostgrestError, Session } from '@supabase/supabase-js';

const PASSWORD_PLACEHOLDER = '********';

type UserProfileRow = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
};

type UserProfileInsertPayload = {
  id: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

type UserProfileUpdatePayload = {
  name?: string | null;
  avatar_url?: string | null;
  updated_at: string;
};

export class SupabaseUserRepository implements IUserRepository {
  private static instance: SupabaseUserRepository;
  private readonly profileTable = 'usuarios';

  private constructor() {}

  public static getInstance(): SupabaseUserRepository {
    if (!SupabaseUserRepository.instance) {
      SupabaseUserRepository.instance = new SupabaseUserRepository();
    }
    return SupabaseUserRepository.instance;
  }

  async save(_user: User): Promise<void> {
    throw new Error('Salvar usuario diretamente nao eh suportado neste repositorio.');
  }

  async findByEmail(email: string): Promise<User | null> {
    const currentUser = await this.getCurrentUser();

    if (currentUser && currentUser.email.value.toLowerCase() === email.toLowerCase()) {
      return currentUser;
    }

    return null;
  }

  async findById(id: string): Promise<User | null> {
    const currentUser = await this.getCurrentUser();

    if (currentUser && currentUser.id === id) {
      return currentUser;
    }

    return null;
  }

  async update(_user: User): Promise<void> {
    throw new Error('Atualizacao direta nao suportada; utilize updateUser.');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Remocao de usuario nao suportada com a chave anon do Supabase.');
  }

  async loginUser({ email, password }: AuthCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(`Falha ao autenticar usuario: ${error.message}`);
    }

    const authUser = data.user ?? data.session?.user;

    if (!authUser) {
      throw new Error('Supabase nao retornou o usuario autenticado.');
    }

    return this.mapAuthUserToDomain(authUser, {
      email,
      password,
    });
  }

  async signUpUser({ name, email, password }: SignUpPayload): Promise<User> {
    const signUpPayload: Parameters<typeof supabase.auth.signUp>[0] = {
      email,
      password,
    };

    if (name) {
      signUpPayload.options = { data: { name } };
    }

    const { data, error } = await supabase.auth.signUp(signUpPayload);

    if (error) {
      throw new Error(`Falha ao registrar usuario: ${error.message}`);
    }

    const authUser = data.user;

    if (!authUser) {
      throw new Error('Supabase nao retornou o usuario recem-criado.');
    }

    const hasSession = await this.ensureAuthenticatedSession(email, password, data.session);

    const metadataName =
      typeof authUser.user_metadata?.name === 'string' ? authUser.user_metadata.name : undefined;

    const profileName = this.resolveNameValue(name ?? metadataName, email);
    let profile: UserProfileRow | null = null;

    if (hasSession) {
      profile = await this.upsertProfile(
        authUser.id,
        { name: profileName, avatar_url: null },
        { name: profileName, email }
      );
    } else {
      console.warn('Sessao nao detectada apos cadastro; perfil sera sincronizado no proximo login.');
    }

    return this.mapAuthUserToDomain(
      authUser,
      {
        name: profileName,
        email,
        password,
      },
      profile
    );
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(`Falha ao encerrar sessao: ${error.message}`);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(`Falha ao recuperar usuario atual: ${error.message}`);
    }

    const authUser = data.user;

    if (!authUser) {
      return null;
    }

    const email = authUser.email;

    if (!email) {
      return null;
    }

    return this.mapAuthUserToDomain(authUser, {
      email,
      password: PASSWORD_PLACEHOLDER,
    });
  }

  async updateUser(userId: string, data: UpdateUserPayload): Promise<User> {
    const currentUser = await this.getCurrentUser();

    if (!currentUser || currentUser.id !== userId) {
      throw new Error('Usuario nao encontrado para atualizacao.');
    }

    const updatePayload: Parameters<typeof supabase.auth.updateUser>[0] = {};
    const metadata: Record<string, unknown> = {};

    if (data.name) {
      metadata.name = data.name;
    }

    if (data.email) {
      updatePayload.email = data.email;
    }

    if (data.password) {
      updatePayload.password = data.password;
    }

    if (data.avatarUrl !== undefined) {
      metadata.avatar_url = data.avatarUrl ?? null;
    }

    if (Object.keys(metadata).length > 0) {
      updatePayload.data = metadata;
    }

    let authUser: SupabaseAuthUser | null = null;

    if (Object.keys(updatePayload).length > 0) {
      const { data: updated, error } = await supabase.auth.updateUser(updatePayload);

      if (error) {
        throw new Error(`Falha ao atualizar dados do usuario: ${error.message}`);
      }

      authUser = updated.user;
    } else {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw new Error(`Falha ao recuperar usuario apos atualizacao: ${error.message}`);
      }

      authUser = data.user;
    }

    if (!authUser || (!authUser.email && !currentUser.email.value)) {
      throw new Error('Supabase nao retornou o usuario apos atualizacao.');
    }

    let profile: UserProfileRow | null = null;
    const profilePayload: Partial<UserProfileRow> = {};

    if (data.name) {
      profilePayload.name = data.name;
    }

    if (data.avatarUrl !== undefined) {
      profilePayload.avatar_url = data.avatarUrl ?? null;
    }

    if (Object.keys(profilePayload).length > 0) {
      profile = await this.upsertProfile(userId, profilePayload, {
        name: data.name ?? currentUser.name.value,
        email: data.email ?? currentUser.email.value,
      });
    }

    return this.mapAuthUserToDomain(
      authUser,
      {
        email: authUser.email ?? currentUser.email.value,
        password: PASSWORD_PLACEHOLDER,
        name: data.name ?? currentUser.name.value,
      },
      profile
    );
  }

  private async mapAuthUserToDomain(
    authUser: SupabaseAuthUser,
    fallback: { name?: string | null; email?: string; password?: string },
    profile?: UserProfileRow | null
  ): Promise<User> {
    const resolvedEmail = fallback.email ?? authUser.email;

    if (!resolvedEmail) {
      throw new Error('Usuario do Supabase nao possui email associado.');
    }

    const metadataName =
      typeof authUser.user_metadata?.name === 'string' ? authUser.user_metadata.name : undefined;

    let profileRow = profile;

    if (!profileRow) {
      try {
        profileRow = await this.fetchProfile(authUser.id);
      } catch (error) {
        console.warn('Falha ao buscar perfil do usuario:', error);
      }
    }

    if (!profileRow) {
      try {
        profileRow = await this.upsertProfile(
          authUser.id,
          {
            name: fallback.name ?? metadataName ?? null,
          },
          { name: fallback.name ?? metadataName ?? null, email: resolvedEmail }
        );
      } catch (error) {
        console.warn('Falha ao sincronizar perfil do usuario:', error);
      }
    }

    const resolvedName = this.resolveNameValue(
      profileRow?.name ?? metadataName ?? fallback.name,
      resolvedEmail
    );

    const resolvedPassword = this.resolvePasswordValue(fallback.password);
    const avatarUrl =
      profileRow?.avatar_url ??
      (typeof authUser.user_metadata?.avatar_url === 'string'
        ? authUser.user_metadata.avatar_url
        : undefined);

    return User.create(
      authUser.id,
      Name.create(resolvedName),
      Email.create(resolvedEmail),
      Password.create(resolvedPassword),
      avatarUrl ?? undefined
    );
  }

  private async fetchProfile(userId: string): Promise<UserProfileRow | null> {
    const { data, error } = await supabase
      .from(this.profileTable)
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Falha ao carregar perfil do usuario: ${error.message}`);
    }

    return data ?? null;
  }

  private async upsertProfile(
    userId: string,
    data: Partial<UserProfileRow>,
    fallback?: { name?: string | null; email?: string | null }
  ): Promise<UserProfileRow | null> {
    if (Object.keys(data).length === 0) {
      return this.fetchProfile(userId);
    }

    const insertPayload = this.buildInsertPayload(userId, data, fallback);

    const { data: createdProfile, error } = await supabase
      .from(this.profileTable)
      .insert(insertPayload)
      .select('*')
      .single();

    if (!error) {
      return createdProfile ?? null;
    }

    if (!this.isConflictError(error)) {
      throw new Error(`Falha ao criar perfil do usuario: ${error.message}`);
    }

    return this.updateProfileRow(userId, data, fallback);
  }

  private async updateProfileRow(
    userId: string,
    data: Partial<UserProfileRow>,
    fallback?: { name?: string | null; email?: string | null }
  ): Promise<UserProfileRow | null> {
    const updatePayload = this.buildUpdatePayload(data, fallback);

    const { data: profile, error } = await supabase
      .from(this.profileTable)
      .update(updatePayload)
      .eq('id', userId)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new Error(`Falha ao atualizar perfil do usuario: ${error.message}`);
    }

    if (!profile) {
      return this.fetchProfile(userId);
    }

    return profile;
  }

  private buildInsertPayload(
    userId: string,
    data: Partial<UserProfileRow>,
    fallback?: { name?: string | null; email?: string | null }
  ): UserProfileInsertPayload {
    const now = new Date().toISOString();
    const resolvedName = this.resolveNameValue(
      data.name ?? fallback?.name ?? null,
      fallback?.email ?? null
    );

    return {
      id: userId,
      name: resolvedName,
      avatar_url: data.avatar_url ?? null,
      created_at: now,
      updated_at: now,
    };
  }

  private buildUpdatePayload(
    data: Partial<UserProfileRow>,
    fallback?: { name?: string | null; email?: string | null }
  ): UserProfileUpdatePayload {
    const payload: UserProfileUpdatePayload = {
      updated_at: new Date().toISOString(),
    };

    if (data.name !== undefined) {
      payload.name = this.resolveNameValue(data.name, fallback?.email ?? null);
    }

    if (data.avatar_url !== undefined) {
      payload.avatar_url = data.avatar_url;
    }

    return payload;
  }

  private isConflictError(error: PostgrestError): boolean {
    if (!error) {
      return false;
    }

    if (error.code === '23505' || error.code === '409') {
      return true;
    }

    const normalizedDetails = `${error.message ?? ''} ${error.details ?? ''}`.toLowerCase();
    return normalizedDetails.includes('duplicate') || normalizedDetails.includes('already exists');
  }

  private async ensureAuthenticatedSession(
    email: string,
    password: string,
    session?: Session | null
  ): Promise<boolean> {
    if (session?.access_token && session?.refresh_token) {
      const { data, error } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      if (!error && data.session) {
        return true;
      }

      console.warn('Falha ao aplicar a sessao retornada pelo cadastro:', error);
    }

    const { data } = await supabase.auth.getSession();

    if (data.session) {
      return true;
    }

    const { data: loginData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.warn('Falha ao autenticar usuario apos cadastro:', error);
      return false;
    }

    return !!(loginData.user ?? loginData.session);
  }

  private resolvePasswordValue(password?: string): string {
    if (password && password.length >= 8) {
      return password;
    }

    return PASSWORD_PLACEHOLDER;
  }

  private resolveNameValue(name: string | null | undefined, email?: string | null): string {
    const trimName = name?.trim();

    if (trimName) {
      return trimName;
    }

    const emailPrefix = email?.split('@')[0]?.trim();

    return emailPrefix && emailPrefix.length > 0 ? emailPrefix : 'User';
  }
}
