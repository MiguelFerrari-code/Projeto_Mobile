import { IMedicamentoRepository } from '../domain/repositories/IMedicamentoRepository';
import { AdicionarMedicamento } from '../domain/use-cases/AdicionarMedicamento';
import { EditarMedicamento } from '../domain/use-cases/EditarMedicamento';
import { ExcluirMedicamento } from '../domain/use-cases/ExcluirMedicamento';
import { ListarMedicamentos } from '../domain/use-cases/ListarMedicamentos';
import { ObterMedicamentoPorId } from '../domain/use-cases/ObterMedicamentoPorId';
import { MockMedicamentoRepository } from '../infra/repositories/MockMedicamentoRepository';

export function makeMedicamentoUseCases() {
  const medicamentoRepository: IMedicamentoRepository = new MockMedicamentoRepository();

  const adicionarMedicamento = new AdicionarMedicamento(medicamentoRepository);
  const editarMedicamento = new EditarMedicamento(medicamentoRepository);
  const excluirMedicamento = new ExcluirMedicamento(medicamentoRepository);
  const listarMedicamentos = new ListarMedicamentos(medicamentoRepository);
  const obterMedicamentoPorId = new ObterMedicamentoPorId(medicamentoRepository);

  return {
    adicionarMedicamento,
    editarMedicamento,
    excluirMedicamento,
    listarMedicamentos,
    obterMedicamentoPorId,
  };
}
