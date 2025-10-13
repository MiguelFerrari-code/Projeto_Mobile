import { ListarMedicamentos } from '../../../domain/use-cases/ListarMedicamentos';
import { IMedicamentoRepository } from '../../../domain/repositories/IMedicamentoRepository';
import { Medicamento } from '../../../domain/entities/Medicamento';

describe('ListarMedicamentos', () => {
  let listarMedicamentos: ListarMedicamentos;
  let mockMedicamentoRepository: jest.Mocked<IMedicamentoRepository>;

  beforeEach(() => {
    mockMedicamentoRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    listarMedicamentos = new ListarMedicamentos(mockMedicamentoRepository);
  });

  it('should return a list of medicamentos', async () => {
    const medicamentos: Medicamento[] = [
      {
        id: '1',
        nome: 'Paracetamol',
        dosagem: '500mg',
        horario: '08:00',
        frequencia: 'A cada 8 horas',
        quantidade: '1 comprimido',
        cor: 'Branco',
      },
      {
        id: '2',
        nome: 'Ibuprofeno',
        dosagem: '200mg',
        horario: '12:00',
        frequencia: 'A cada 6 horas',
        quantidade: '1 comprimido',
        cor: 'Branco',
      },
    ];

    mockMedicamentoRepository.findAll.mockResolvedValue(medicamentos);

    const result = await listarMedicamentos.execute();

    expect(result).toEqual(medicamentos);
    expect(mockMedicamentoRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array if no medicamentos are found', async () => {
    mockMedicamentoRepository.findAll.mockResolvedValue([]);

    const result = await listarMedicamentos.execute();

    expect(result).toEqual([]);
    expect(mockMedicamentoRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
