import { ExcluirMedicamento } from "../../../domain/use-cases/ExcluirMedicamento";
import { MockMedicamentoRepository } from "../../../infra/repositories/MockMedicamentoRepository";
import { Medicamento } from "../../../domain/entities/Medicamento";

describe("ExcluirMedicamento", () => {
  let mockMedicamentoRepository: MockMedicamentoRepository;
  let excluirMedicamento: ExcluirMedicamento;

  beforeEach(() => {
    mockMedicamentoRepository = new MockMedicamentoRepository();
    excluirMedicamento = new ExcluirMedicamento(mockMedicamentoRepository);
  });

  it("should delete an existing medicamento", async () => {
    const medicamento: Medicamento = {
      id: "1",
      nome: "Paracetamol",
      dosagem: "500mg",
      horario: "08:00",
      frequencia: "3x por dia",
      quantidade: "3/30",
      cor: "#ffffffff",
    };
    await mockMedicamentoRepository.save(medicamento);

    await excluirMedicamento.execute("1");

    const foundMedicamento = await mockMedicamentoRepository.findById("1");
    expect(foundMedicamento).toBeNull();
  });
});

