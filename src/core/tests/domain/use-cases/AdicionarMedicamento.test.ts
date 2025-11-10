import { AdicionarMedicamento } from "../../../domain/use-cases/AdicionarMedicamento";
import { MockMedicamentoRepository } from "../../../infra/repositories/MockMedicamentoRepository";
import { Medicamento } from "../../../domain/entities/Medicamento";

describe("AdicionarMedicamento", () => {
  let mockMedicamentoRepository: MockMedicamentoRepository;
  let adicionarMedicamento: AdicionarMedicamento;

  beforeEach(() => {
    mockMedicamentoRepository = new MockMedicamentoRepository();
    adicionarMedicamento = new AdicionarMedicamento(mockMedicamentoRepository);
  });

  it("should add a new medicamento", async () => {
    const medicamento: Medicamento = {
      id: "1",
      usuarioId: "user-1",
      nome: "Paracetamol",
      dosagem: "500mg",
      horario: "08:00",
      frequencia: "3x por dia",
      quantidadeConsumida: 3,
      quantidadeTotal: 30,
      cor: "#ffffffff",
      fotoUri: undefined,
    };

    await adicionarMedicamento.execute(medicamento);

    const foundMedicamento = await mockMedicamentoRepository.findById("1");
    expect(foundMedicamento).toEqual(medicamento);
  });
});
