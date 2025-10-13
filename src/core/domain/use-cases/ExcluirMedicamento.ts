import { IMedicamentoRepository } from "../repositories/IMedicamentoRepository";

export class ExcluirMedicamento {
  constructor(private medicamentoRepository: IMedicamentoRepository) {}

  async execute(id: string): Promise<void> {
    await this.medicamentoRepository.delete(id);
  }
}

