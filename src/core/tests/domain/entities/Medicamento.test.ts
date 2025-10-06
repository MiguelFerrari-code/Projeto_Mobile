import { Medicamento } from "../../../domain/entities/Medicamento";

describe("Medicamento", () => {
  it("should create a valid medicamento", () => {
    const medicamento: Medicamento = {
      id: "1",
      nome: "Paracetamol",
      dosagem: "500mg",
      horario: "08:00",
      frequencia: "A cada 8 horas",
      quantidade: "1 comprimido",
      cor: "red",
    };

    expect(medicamento.id).toBe("1");
    expect(medicamento.nome).toBe("Paracetamol");
    expect(medicamento.dosagem).toBe("500mg");
    expect(medicamento.horario).toBe("08:00");
    expect(medicamento.frequencia).toBe("A cada 8 horas");
    expect(medicamento.quantidade).toBe("1 comprimido");
    expect(medicamento.cor).toBe("red");
  });
});
