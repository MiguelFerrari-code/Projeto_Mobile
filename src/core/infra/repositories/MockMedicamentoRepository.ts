import { IMedicamentoRepository } from "../../domain/repositories/IMedicamentoRepository";
import { Medicamento } from "../../domain/entities/Medicamento";

export class MockMedicamentoRepository implements IMedicamentoRepository {
  private medicamentos: Medicamento[] = [];

  async save(medicamento: Medicamento): Promise<void> {
    this.medicamentos.push(medicamento);
  }

  async findById(id: string): Promise<Medicamento | null> {
    return this.medicamentos.find((m) => m.id === id) || null;
  }

  async findAll(): Promise<Medicamento[]> {
    return this.medicamentos;
  }

  async update(medicamento: Medicamento): Promise<void> {
    const index = this.medicamentos.findIndex((m) => m.id === medicamento.id);
    if (index !== -1) {
      this.medicamentos[index] = medicamento;
    }
  }

  async delete(id: string): Promise<void> {
    this.medicamentos = this.medicamentos.filter((m) => m.id !== id);
  }
}

