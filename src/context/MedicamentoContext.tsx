
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Medicamento {
  id: number;
  nome: string;
  dosagem: string;
  horario: string;
  frequencia: string;
  quantidade: string;
  cor: string;
  foto?: string; // URI da foto do medicamento (opcional)
}

interface MedicamentoContextType {
  medicamentos: Medicamento[];
  adicionarMedicamento: (medicamento: Omit<Medicamento, 'id'>) => void;
  editarMedicamento: (medicamentoAtualizado: Medicamento) => void;
  excluirMedicamento: (id: number) => void;
}

const MedicamentoContext = createContext<MedicamentoContextType | undefined>(undefined);

export const MedicamentoProvider = ({ children }: { children: ReactNode }) => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

  const adicionarMedicamento = (novoMedicamento: Omit<Medicamento, 'id'>) => {
    const id = medicamentos.length > 0 ? Math.max(...medicamentos.map(m => m.id)) + 1 : 1;
    setMedicamentos(prevMedicamentos => [...prevMedicamentos, { ...novoMedicamento, id }]);
  };

  const editarMedicamento = (medicamentoAtualizado: Medicamento) => {
    setMedicamentos(prevMedicamentos =>
      prevMedicamentos.map(med =>
        med.id === medicamentoAtualizado.id ? medicamentoAtualizado : med
      )
    );
  };

  const excluirMedicamento = (id: number) => {
    setMedicamentos(prevMedicamentos => prevMedicamentos.filter(med => med.id !== id));
  };

  return (
    <MedicamentoContext.Provider value={{
      medicamentos,
      adicionarMedicamento,
      editarMedicamento,
      excluirMedicamento,
    }}>
      {children}
    </MedicamentoContext.Provider>
  );
};

export const useMedicamentos = () => {
  const context = useContext(MedicamentoContext);
  if (!context) {
    throw new Error('useMedicamentos must be used within a MedicamentoProvider');
  }
  return context;
};

