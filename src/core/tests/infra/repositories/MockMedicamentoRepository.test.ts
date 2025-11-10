import { MockMedicamentoRepository } from '../../../infra/repositories/MockMedicamentoRepository';
import { Medicamento } from '../../../domain/entities/Medicamento';

describe('MockMedicamentoRepository', () => {
  let repository: MockMedicamentoRepository;

  beforeEach(() => {
    repository = new MockMedicamentoRepository();
  });

  it('should save a medicamento', async () => {
    const medicamento: Medicamento = {
      id: '1',
      usuarioId: 'user-1',
      nome: 'Paracetamol',
      dosagem: '500mg',
      horario: '08:00',
      frequencia: 'A cada 8 horas',
      quantidadeConsumida: 1,
      quantidadeTotal: 30,
      cor: 'Branco',
      fotoUri: undefined,
    };

    await repository.save(medicamento);

    const found = await repository.findById('1');
    expect(found).toEqual(medicamento);
  });

  it('should find all medicamentos', async () => {
    const medicamento1: Medicamento = {
      id: '1',
      usuarioId: 'user-1',
      nome: 'Paracetamol',
      dosagem: '500mg',
      horario: '08:00',
      frequencia: 'A cada 8 horas',
      quantidadeConsumida: 1,
      quantidadeTotal: 30,
      cor: 'Branco',
      fotoUri: undefined,
    };
    const medicamento2: Medicamento = {
      id: '2',
      usuarioId: 'user-2',
      nome: 'Ibuprofeno',
      dosagem: '200mg',
      horario: '12:00',
      frequencia: 'A cada 6 horas',
      quantidadeConsumida: 1,
      quantidadeTotal: 20,
      cor: 'Branco',
      fotoUri: undefined,
    };

    await repository.save(medicamento1);
    await repository.save(medicamento2);

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
    expect(all).toContainEqual(medicamento1);
    expect(all).toContainEqual(medicamento2);
  });

  it('should update a medicamento', async () => {
    const medicamento: Medicamento = {
      id: '1',
      usuarioId: 'user-1',
      nome: 'Paracetamol',
      dosagem: '500mg',
      horario: '08:00',
      frequencia: 'A cada 8 horas',
      quantidadeConsumida: 1,
      quantidadeTotal: 30,
      cor: 'Branco',
      fotoUri: undefined,
    };

    await repository.save(medicamento);

    const updatedMedicamento: Medicamento = { ...medicamento, nome: 'Tylenol' };
    await repository.update(updatedMedicamento);

    const found = await repository.findById('1');
    expect(found?.nome).toBe('Tylenol');
  });

  it('should delete a medicamento', async () => {
    const medicamento: Medicamento = {
      id: '1',
      usuarioId: 'user-1',
      nome: 'Paracetamol',
      dosagem: '500mg',
      horario: '08:00',
      frequencia: 'A cada 8 horas',
      quantidadeConsumida: 1,
      quantidadeTotal: 30,
      cor: 'Branco',
      fotoUri: undefined,
    };

    await repository.save(medicamento);
    await repository.delete('1');

    const found = await repository.findById('1');
    expect(found).toBeNull();
  });
});
