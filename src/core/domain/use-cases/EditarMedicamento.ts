import { Medicamento } from "../entities/Medicamento";
import { IMedicamentoRepository } from "../repositories/IMedicamentoRepository";

export class EditarMedicamento {
  constructor(private medicamentoRepository: IMedicamentoRepository) {}

  async execute(medicamento: Medicamento): Promise<void> {
    await this.medicamentoRepository.update(medicamento);
  }
}

