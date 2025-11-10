import { supabase } from '../core/infra/supabase/client/supabaseClient';

export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Erro na conexao com Supabase:', error.message);
      return false;
    }

    console.log('Conexao com Supabase OK!');
    console.log('Sessao atual:', data.session ? 'Ativa' : 'Vazia');
    return true;
  } catch (err) {
    console.error('Erro inesperado ao testar Supabase:', err);
    return false;
  }
}
