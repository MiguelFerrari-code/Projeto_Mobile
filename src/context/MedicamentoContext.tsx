import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { makeMedicamentoUseCases } from '../core/factories/MakeMedicamentoUseCases';
import { Medicamento } from '../core/domain/entities/Medicamento';
import { useAuth } from './auth';
import { SQLiteMedicamentoRepository } from '../core/infra/repositories/sqlite/sqliteMedicamentoRepository';

export type MedicamentoInput = {
  nome: string;
  dosagem: string;
  horario: string;
  frequencia: string;
  quantidadeConsumida: number;
  quantidadeTotal: number;
  dosesDia?: string;
  fotoUri?: string | null;
  cor?: string;
};

export type MedicamentoViewModel = {
  id: number;
  nome: string;
  dosagem: string;
  horario: string;
  frequencia: string;
  quantidadeConsumida: number;
  quantidadeTotal: number;
  dosesDia?: string;
  fotoUri?: string | null;
  cor: string;
  createdAt?: string;
};

interface MedicamentoContextType {
  medicamentos: MedicamentoViewModel[];
  loading: boolean;
  adicionarMedicamento: (medicamento: MedicamentoInput) => Promise<void>;
  editarMedicamento: (id: number, medicamento: MedicamentoInput) => Promise<void>;
  excluirMedicamento: (id: number) => Promise<void>;
  sincronizarMedicamentos: () => Promise<void>;
}

const MedicamentoContext = createContext<MedicamentoContextType | undefined>(undefined);

function parseId(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function toNumber(value?: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Number(value);
}

export const MedicamentoProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [medicamentos, setMedicamentos] = useState<MedicamentoViewModel[]>([]);
  const [loading, setLoading] = useState(false);

  const medicamentoUseCases = useMemo(() => {
    if (!user?.id) {
      return null;
    }

    const repository = new SQLiteMedicamentoRepository(user.id);
    return makeMedicamentoUseCases(repository);
  }, [user?.id]);

  const mapDomainToView = useCallback((medicamento: Medicamento): MedicamentoViewModel => {
    return {
      id: parseId(medicamento.id),
      nome: medicamento.nome,
      dosagem: medicamento.dosagem,
      horario: medicamento.horario,
      frequencia: medicamento.frequencia,
      quantidadeConsumida: toNumber(medicamento.quantidadeConsumida),
      quantidadeTotal: toNumber(medicamento.quantidadeTotal),
      dosesDia: medicamento.dosesDia,
      fotoUri: medicamento.fotoUri,
      cor: medicamento.cor ?? '#ffffffff',
      createdAt: medicamento.createdAt,
    };
  }, []);

  const sincronizarMedicamentos = useCallback(async () => {
    if (!user) {
      setMedicamentos([]);
      return;
    }

    if (!medicamentoUseCases) {
      setMedicamentos([]);
      return;
    }

    setLoading(true);
    try {
      const domainMedicamentos = await medicamentoUseCases.listarMedicamentos.execute();
      setMedicamentos(domainMedicamentos.map(mapDomainToView));
    } catch (error) {
      console.error('Erro ao listar medicamentos:', error);
    } finally {
      setLoading(false);
    }
  }, [mapDomainToView, medicamentoUseCases, user]);

  const buildDomainMedicamento = useCallback(
    (id: string, data: MedicamentoInput): Medicamento => ({
      id,
      usuarioId: user?.id ?? '',
      nome: data.nome,
      dosagem: data.dosagem,
      horario: data.horario,
      frequencia: data.frequencia,
      quantidadeConsumida: data.quantidadeConsumida,
      quantidadeTotal: data.quantidadeTotal,
      dosesDia: data.dosesDia,
      fotoUri: data.fotoUri ?? undefined,
      cor: data.cor ?? '#ffffffff',
    }),
    [user?.id]
  );

  const adicionarMedicamento = useCallback(
    async (data: MedicamentoInput): Promise<void> => {
      if (!user) {
        throw new Error('Usuario nao autenticado.');
      }

      if (!medicamentoUseCases) {
        throw new Error('Use cases nao inicializados.');
      }

      const tempId = Date.now().toString();
      const domainMedicamento = buildDomainMedicamento(tempId, data);

      try {
        await medicamentoUseCases.adicionarMedicamento.execute(domainMedicamento);
        setMedicamentos((current) => [mapDomainToView(domainMedicamento), ...current]);
      } catch (error) {
        console.error('Erro ao adicionar medicamento:', error);
        throw error;
      }
    },
    [buildDomainMedicamento, medicamentoUseCases, mapDomainToView, user]
  );

  const editarMedicamento = useCallback(
    async (id: number, data: MedicamentoInput): Promise<void> => {
      if (!user) {
        throw new Error('Usuario nao autenticado.');
      }

      if (!medicamentoUseCases) {
        throw new Error('Use cases nao inicializados.');
      }

      const domainMedicamento = buildDomainMedicamento(String(id), data);

      try {
        await medicamentoUseCases.editarMedicamento.execute(domainMedicamento);
        setMedicamentos((current) =>
          current.map((item) => (item.id === id ? mapDomainToView(domainMedicamento) : item))
        );
      } catch (error) {
        console.error('Erro ao editar medicamento:', error);
        throw error;
      }
    },
    [buildDomainMedicamento, medicamentoUseCases, mapDomainToView, user]
  );

  const excluirMedicamento = useCallback(
    async (id: number): Promise<void> => {
      if (!user) {
        throw new Error('Usuario nao autenticado.');
      }

      if (!medicamentoUseCases) {
        throw new Error('Use cases nao inicializados.');
      }

      try {
        await medicamentoUseCases.excluirMedicamento.execute(String(id));
        setMedicamentos((current) => current.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Erro ao excluir medicamento:', error);
        throw error;
      }
    },
    [medicamentoUseCases, user]
  );

  useEffect(() => {
    if (!user) {
      setMedicamentos([]);
      return;
    }

    sincronizarMedicamentos();
  }, [sincronizarMedicamentos, user]);

  return (
    <MedicamentoContext.Provider
      value={{
        medicamentos,
        loading,
        adicionarMedicamento,
        editarMedicamento,
        excluirMedicamento,
        sincronizarMedicamentos,
      }}
    >
      {children}
    </MedicamentoContext.Provider>
  );
};

export const useMedicamentos = (): MedicamentoContextType => {
  const context = useContext(MedicamentoContext);

  if (!context) {
    throw new Error('useMedicamentos must be used within a MedicamentoProvider');
  }

  return context;
};
