import { Medicamento } from "../entities/Medicamento";
import { IMedicamentoRepository } from "../repositories/IMedicamentoRepository";

export class AdicionarMedicamento {
  constructor(private medicamentoRepository: IMedicamentoRepository) {}

  async execute(medicamento: Medicamento): Promise<void> {
    await this.medicamentoRepository.save(medicamento);
  }
}

