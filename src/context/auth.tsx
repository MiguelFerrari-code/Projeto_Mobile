import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos para o contexto de autenticação
interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Adicionado para permitir a exibição da senha no perfil (apenas para mock)
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Credenciais mock hardcoded
const MOCK_USERS = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    password: '123456'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    password: 'senha123'
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@email.com',
    password: 'minhasenha'
  }
];

// Criar o contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provider do contexto de autenticação
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  // Função de login mock
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simular delay de requisição
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar credenciais mock
    const foundUser = MOCK_USERS.find(
      mockUser => mockUser.email === email && mockUser.password === password
    );

    if (foundUser) {
      // const { password: _, ...userWithoutPassword } = foundUser; // Comentado para incluir a senha no mock
      const userWithPassword = foundUser;
      setUser(userWithPassword);
      return true;
    }

    return false;
  };

  // Função de logout
  const logout = () => {
    setUser(null);
  };

  // Função de registro mock
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simular delay de requisição
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar se o email já existe
    const emailExists = MOCK_USERS.some(mockUser => mockUser.email === email);
    
    if (emailExists) {
      return false; // Email já existe
    }

        // Adicionar o novo usuário ao array mock
    MOCK_USERS.push({
      id: String(MOCK_USERS.length + 1),
      name,
      email,
      password,
    });
    return true; // Registro bem-sucedido
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto de autenticação
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}