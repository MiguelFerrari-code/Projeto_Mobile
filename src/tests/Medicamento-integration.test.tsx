import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreen } from '../screens/MainScreen';
import { AdicionarMedicamento } from '../screens/AdicionarMedicamento';
import { EditarMedicamento } from '../screens/EditarMedicamento';
import { MedicamentoProvider } from '../context/MedicamentoContext';
import { AuthProvider } from '../context/auth';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={MainScreen} />
    <Stack.Screen name="AdicionarMedicamento" component={AdicionarMedicamento} />
    <Stack.Screen name="EditarMedicamento" component={EditarMedicamento} />
  </Stack.Navigator>
);

describe('Medicamento CRUD Integration', () => {
  it('should perform the full CRUD cycle for a medicamento', async () => {
    const { getByText, getByPlaceholderText, queryByText, findByText, getByTestId } = render(
      <AuthProvider>
        <MedicamentoProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </MedicamentoProvider>
      </AuthProvider>
    );

    // CREATE
    fireEvent.press(getByTestId('add-button'));
    
    await findByText('Adicionar Medicamento');

    fireEvent.changeText(getByPlaceholderText('Ex: Paracetamol'), 'Ibuprofeno');
    fireEvent.changeText(getByPlaceholderText('Ex: 500mg'), '600mg');
    fireEvent.changeText(getByPlaceholderText('08:00'), '09:00');
    fireEvent.changeText(getByPlaceholderText('24:00'), '12:00');
    fireEvent.changeText(getByPlaceholderText('Ex: 01'), '2');
    fireEvent.press(getByText('Salvar Medicamento'));

    // READ
    await findByText('Ibuprofeno');
    expect(getByText('Ibuprofeno')).toBeTruthy();
    expect(getByText('600mg')).toBeTruthy();

    // UPDATE
    // The initial state has 3 medicines, so the new one will have id 4
    fireEvent.press(getByTestId('edit-button-4'));

    await findByText('Editar Medicamento');

    fireEvent.changeText(getByPlaceholderText('Ex: Paracetamol'), 'Ibuprofeno Editado');
    fireEvent.press(getByText('Salvar Medicamento'));

    await findByText('Ibuprofeno Editado');
    expect(queryByText('Ibuprofeno')).toBeNull();

    // DELETE
    fireEvent.press(getByTestId('delete-button-4'));

    await waitFor(() => {
      expect(queryByText('Ibuprofeno Editado')).toBeNull();
    });
  });
});