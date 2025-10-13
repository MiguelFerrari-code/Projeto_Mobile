import { Medicamento } from "../entities/Medicamento";
import { IMedicamentoRepository } from "../repositories/IMedicamentoRepository";

export class ListarMedicamentos {
  constructor(private medicamentoRepository: IMedicamentoRepository) {}

  async execute(): Promise<Medicamento[]> {
    return this.medicamentoRepository.findAll();
  }
}

