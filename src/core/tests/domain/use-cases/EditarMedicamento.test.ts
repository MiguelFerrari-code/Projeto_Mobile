import { EditarMedicamento } from "../../../domain/use-cases/EditarMedicamento";
import { MockMedicamentoRepository } from "../../../infra/repositories/MockMedicamentoRepository";
import { Medicamento } from "../../../domain/entities/Medicamento";

describe("EditarMedicamento", () => {
  let mockMedicamentoRepository: MockMedicamentoRepository;
  let editarMedicamento: EditarMedicamento;

  beforeEach(() => {
    mockMedicamentoRepository = new MockMedicamentoRepository();
    editarMedicamento = new EditarMedicamento(mockMedicamentoRepository);
  });

  it("should update an existing medicamento", async () => {
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

    const updatedMedicamento: Medicamento = {
      ...medicamento,
      dosagem: "750mg",
      horario: "09:00",
    };

    await editarMedicamento.execute(updatedMedicamento);

    const foundMedicamento = await mockMedicamentoRepository.findById("1");
    expect(foundMedicamento).toEqual(updatedMedicamento);
  });
});

