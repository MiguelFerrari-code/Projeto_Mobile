import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MedicamentoProvider, useMedicamentos } from '../context/MedicamentoContext';
import { Text } from 'react-native'; // Importar Text do react-native

// Componente de teste para consumir o contexto
const TestComponent = () => {
  const { medicamentos, adicionarMedicamento, editarMedicamento, excluirMedicamento } = useMedicamentos();

  return (
    <>
      <button onPress={() => adicionarMedicamento({ nome: 'Novo Medicamento', dosagem: '10mg', horario: '10:00', frequencia: '1x por dia', quantidade: '10/10', cor: '#FFFFFF' })} data-testid="add-button">Adicionar</button>
      <button onPress={() => editarMedicamento({ id: 1, nome: 'Paracetamol Editado', dosagem: '500mg', horario: '08:00', frequencia: '3x por dia', quantidade: '3/30', cor: '#FFFFFF' })} data-testid="edit-button">Editar</button>
      <button onPress={() => excluirMedicamento(1)} data-testid="delete-button">Excluir</button>
      {
        medicamentos.map(med => (
          <Text key={med.id} data-testid={`medicamento-${med.id}`}>
            {med.nome} - {med.dosagem}
          </Text>
        ))
      }
    </>
  );
};

describe('MedicamentoContext Integration Tests', () => {
  it('should add a new medication', () => {
    render(
      <MedicamentoProvider>
        <TestComponent />
      </MedicamentoProvider>
    );

    fireEvent.press(screen.getByTestId('add-button'));
    expect(screen.getByTestId('medicamento-4')).toHaveTextContent('Novo Medicamento - 10mg');
  });

  it('should edit an existing medication', () => {
    render(
      <MedicamentoProvider>
        <TestComponent />
      </MedicamentoProvider>
    );

    fireEvent.press(screen.getByTestId('edit-button'));
    expect(screen.getByTestId('medicamento-1')).toHaveTextContent('Paracetamol Editado - 500mg');
  });

  it('should delete a medication', () => {
    render(
      <MedicamentoProvider>
        <TestComponent />
      </MedicamentoProvider>
    );

    fireEvent.press(screen.getByTestId('delete-button'));
    expect(screen.queryByTestId('medicamento-1')).toBeNull();
  });
});
