import { makeMedicamentoUseCases } from '../../../factories/MakeMedicamentoUseCases';
import { AdicionarMedicamento } from '../../../domain/use-cases/AdicionarMedicamento';
import { EditarMedicamento } from '../../../domain/use-cases/EditarMedicamento';
import { ExcluirMedicamento } from '../../../domain/use-cases/ExcluirMedicamento';
import { ListarMedicamentos } from '../../../domain/use-cases/ListarMedicamentos';
import { ObterMedicamentoPorId } from '../../../domain/use-cases/ObterMedicamentoPorId';
import { MockMedicamentoRepository } from '../../../infra/repositories/MockMedicamentoRepository';

describe('makeMedicamentoUseCases', () => {
  const buildUseCases = () => {
    const repository = new MockMedicamentoRepository();
    const useCases = makeMedicamentoUseCases(repository);
    return { useCases, repository };
  };

  it('should return an object with all medicamento use cases', () => {
    const { useCases } = buildUseCases();

    expect(useCases).toHaveProperty('adicionarMedicamento');
    expect(useCases).toHaveProperty('editarMedicamento');
    expect(useCases).toHaveProperty('excluirMedicamento');
    expect(useCases).toHaveProperty('listarMedicamentos');
    expect(useCases).toHaveProperty('obterMedicamentoPorId');
  });

  it('should instantiate AdicionarMedicamento with MockMedicamentoRepository', () => {
    const { useCases } = buildUseCases();
    expect(useCases.adicionarMedicamento).toBeInstanceOf(AdicionarMedicamento);
    // Further checks could involve mocking the constructor to ensure the correct repository is passed
  });

  it('should instantiate EditarMedicamento with MockMedicamentoRepository', () => {
    const { useCases } = buildUseCases();
    expect(useCases.editarMedicamento).toBeInstanceOf(EditarMedicamento);
  });

  it('should instantiate ExcluirMedicamento with MockMedicamentoRepository', () => {
    const { useCases } = buildUseCases();
    expect(useCases.excluirMedicamento).toBeInstanceOf(ExcluirMedicamento);
  });

  it('should instantiate ListarMedicamentos with MockMedicamentoRepository', () => {
    const { useCases } = buildUseCases();
    expect(useCases.listarMedicamentos).toBeInstanceOf(ListarMedicamentos);
  });

  it('should instantiate ObterMedicamentoPorId with MockMedicamentoRepository', () => {
    const { useCases } = buildUseCases();
    expect(useCases.obterMedicamentoPorId).toBeInstanceOf(ObterMedicamentoPorId);
  });

  it('should use the same instance of MockMedicamentoRepository for all use cases', () => {
    const { useCases, repository } = buildUseCases();
    expect(useCases.adicionarMedicamento['medicamentoRepository']).toBeInstanceOf(MockMedicamentoRepository);
    expect(useCases.editarMedicamento['medicamentoRepository']).toBeInstanceOf(MockMedicamentoRepository);
    expect(useCases.excluirMedicamento['medicamentoRepository']).toBeInstanceOf(MockMedicamentoRepository);
    expect(useCases.listarMedicamentos['medicamentoRepository']).toBeInstanceOf(MockMedicamentoRepository);
    expect(useCases.obterMedicamentoPorId['medicamentoRepository']).toBeInstanceOf(MockMedicamentoRepository);

    // Verify they are the *same* instance
    const repoFromAdicionar = useCases.adicionarMedicamento['medicamentoRepository'];
    expect(repoFromAdicionar).toBe(repository);
    expect(useCases.editarMedicamento['medicamentoRepository']).toBe(repoFromAdicionar);
    expect(useCases.excluirMedicamento['medicamentoRepository']).toBe(repoFromAdicionar);
    expect(useCases.listarMedicamentos['medicamentoRepository']).toBe(repoFromAdicionar);
    expect(useCases.obterMedicamentoPorId['medicamentoRepository']).toBe(repoFromAdicionar);
  });
});
