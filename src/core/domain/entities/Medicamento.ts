export interface Medicamento {
  id: string;
  usuarioId: string;
  nome: string;
  dosagem: string;
  horario: string;
  frequencia: string;
  quantidadeConsumida: number;
  quantidadeTotal: number;
  cor: string;
  fotoUri?: string;
}
