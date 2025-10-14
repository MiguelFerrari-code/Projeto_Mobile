import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../screens/Login';
import { Register } from '../screens/Register';
import { AuthProvider } from '../context/auth';
import { MainScreen } from '../screens/MainScreen';
import { MockUserRepository } from '../core/infra/repositories/MockUserRepository';
import { MedicamentoProvider } from '../context/MedicamentoContext';

const Stack = createNativeStackNavigator();

describe('LoginScreen Integration', () => {
  let mockUserRepository: MockUserRepository;

  beforeEach(() => {
    mockUserRepository = MockUserRepository.getInstance();
    mockUserRepository.reset();
  });

  it('should login successfully after registering', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <AuthProvider>
        <MedicamentoProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Register">
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Main" component={MainScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </MedicamentoProvider>
      </AuthProvider>
    );

    // Registration
    fireEvent.changeText(getByPlaceholderText('José Maria dos Santos'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('@josemaria'), '@testexample');
    fireEvent.changeText(getByPlaceholderText('********'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirmar Senha'), 'password123');
    fireEvent.press(getByText('Cadastrar'));
    
    // Navigate to Login
    fireEvent.press(getByText('Possuo cadastro'));
    
    // Wait for navigation to Login screen and login
    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('********'), 'password123');
      fireEvent.press(getByText('Entrar'));
    });
  });
});