import { Medicamento } from "../../../domain/entities/Medicamento";

describe("Medicamento", () => {
  it("should create a valid medicamento", () => {
    const medicamento: Medicamento = {
      id: "1",
      usuarioId: "user-1",
      nome: "Paracetamol",
      dosagem: "500mg",
      horario: "08:00",
      frequencia: "A cada 8 horas",
      quantidadeConsumida: 1,
      quantidadeTotal: 30,
      cor: "red",
      fotoUri: "https://example.com/foto.png",
    };

    expect(medicamento.id).toBe("1");
    expect(medicamento.usuarioId).toBe("user-1");
    expect(medicamento.nome).toBe("Paracetamol");
    expect(medicamento.dosagem).toBe("500mg");
    expect(medicamento.horario).toBe("08:00");
    expect(medicamento.frequencia).toBe("A cada 8 horas");
    expect(medicamento.quantidadeConsumida).toBe(1);
    expect(medicamento.quantidadeTotal).toBe(30);
    expect(medicamento.cor).toBe("red");
    expect(medicamento.fotoUri).toBe("https://example.com/foto.png");
  });
});
