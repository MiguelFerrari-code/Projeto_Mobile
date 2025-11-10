import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { makeUserUseCases } from '../core/factories/MakeUserUseCases';
import { User as DomainUser } from '../core/domain/entities/User';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  password?: string;
  avatarUrl?: string;
}

interface AuthContextData {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<Pick<AuthUser, 'name' | 'email' | 'password' | 'avatarUrl'>>) => Promise<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function mapDomainUserToAuthUser(user: DomainUser): AuthUser {
  return {
    id: user.id,
    name: user.name.value,
    email: user.email.value,
    password: user.password.value,
    avatarUrl: user.avatarUrl,
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const userUseCases = useMemo(() => makeUserUseCases(), []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const domainUser = await userUseCases.loginUser.execute(email, password);

      if (!domainUser) {
        return false;
      }

      setUser(mapDomainUserToAuthUser(domainUser));
      return true;
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await userUseCases.logoutUser.execute();
    } finally {
      setUser(null);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await userUseCases.registerUser.execute({
        name,
        email,
        password,
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao cadastrar usuario:', error);
      let message = 'Ocorreu um erro durante o cadastro.';

      if (error instanceof Error) {
        const normalized = error.message.toLowerCase();

        if (
          normalized.includes('ja existe') ||
          normalized.includes('já existe') ||
          normalized.includes('already registered') ||
          normalized.includes('usuario ja cadastrado') ||
          normalized.includes('user already registered')
        ) {
          message = 'Este email já está cadastrado.';
        } else {
          message = error.message;
        }
      }

      return { success: false, error: message };
    }
  };

  const updateProfile = async (
    data: Partial<Pick<AuthUser, 'name' | 'email' | 'password' | 'avatarUrl'>>
  ): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const updatedUser = await userUseCases.updateUser.execute(user.id, data);
      setUser(mapDomainUserToAuthUser(updatedUser));
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuario:', error);
      return false;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
