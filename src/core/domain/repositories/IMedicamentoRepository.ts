import { Medicamento } from '../entities/Medicamento';

export interface IMedicamentoRepository {
  save(medicamento: Medicamento): Promise<void>;
  findById(id: string): Promise<Medicamento | null>;
  findAll(): Promise<Medicamento[]>;
  update(medicamento: Medicamento): Promise<void>;
  delete(id: string): Promise<void>;
}

