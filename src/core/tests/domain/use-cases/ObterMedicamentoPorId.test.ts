import { ObterMedicamentoPorId } from '../../../domain/use-cases/ObterMedicamentoPorId';
import { IMedicamentoRepository } from '../../../domain/repositories/IMedicamentoRepository';
import { Medicamento } from '../../../domain/entities/Medicamento';

describe('ObterMedicamentoPorId', () => {
  let obterMedicamentoPorId: ObterMedicamentoPorId;
  let mockMedicamentoRepository: jest.Mocked<IMedicamentoRepository>;

  beforeEach(() => {
    mockMedicamentoRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    obterMedicamentoPorId = new ObterMedicamentoPorId(mockMedicamentoRepository);
  });

  it('should return a medicamento if found', async () => {
    const medicamento: Medicamento = {
      id: '1',
      nome: 'Paracetamol',
      dosagem: '500mg',
      horario: '08:00',
      frequencia: 'A cada 8 horas',
      quantidade: '1 comprimido',
      cor: 'Branco',
    };

    mockMedicamentoRepository.findById.mockResolvedValue(medicamento);

    const result = await obterMedicamentoPorId.execute('1');

    expect(result).toEqual(medicamento);
    expect(mockMedicamentoRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should return null if medicamento is not found', async () => {
    mockMedicamentoRepository.findById.mockResolvedValue(null);

    const result = await obterMedicamentoPorId.execute('999');

    expect(result).toBeNull();
    expect(mockMedicamentoRepository.findById).toHaveBeenCalledWith('999');
  });
});
