export interface Medicamento {
  id: string;
  usuarioId: string;
  nome: string;
  dosagem: string;
  horario: string;
  frequencia: string;
  quantidadeConsumida: number;
  quantidadeTotal: number;
  dosesDia?: string;
  cor: string;
  fotoUri?: string;
  createdAt?: string;
  updatedAt?: string;
}
