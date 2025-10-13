import { Medicamento } from "../entities/Medicamento";
import { IMedicamentoRepository } from "../repositories/IMedicamentoRepository";

export class ObterMedicamentoPorId {
  constructor(private medicamentoRepository: IMedicamentoRepository) {}

  async execute(id: string): Promise<Medicamento | null> {
    return this.medicamentoRepository.findById(id);
  }
}

