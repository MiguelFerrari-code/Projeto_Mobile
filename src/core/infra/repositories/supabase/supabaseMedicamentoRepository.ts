import { IMedicamentoRepository } from '../../../domain/repositories/IMedicamentoRepository';
import { Medicamento } from '../../../domain/entities/Medicamento';
import { supabase } from '../../supabase/client/supabaseClient';

type MedicamentoRow = {
  id: number;
  created_at: string;
  user_id: string;
  nome: string | null;
  dosagem: string | null;
  horario: string | null;
  frequencia: string | null;
  quantidadeConsumida: string | null;
  quantidadeTotal: string | null;
  dosesDia: string | null;
  fotoUri: string | null;
};

type MedicamentoInsertPayload = Omit<
  MedicamentoRow,
  'id' | 'created_at'
>;

type MedicamentoUpdatePayload = Partial<MedicamentoInsertPayload>;

export class SupabaseMedicamentoRepository implements IMedicamentoRepository {
  private static instance: SupabaseMedicamentoRepository;
  private readonly tableName = 'Medicamentos';

  private constructor() {}

  static getInstance(): SupabaseMedicamentoRepository {
    if (!SupabaseMedicamentoRepository.instance) {
      SupabaseMedicamentoRepository.instance = new SupabaseMedicamentoRepository();
    }
    return SupabaseMedicamentoRepository.instance;
  }

  async save(medicamento: Medicamento): Promise<void> {
    const payload = this.buildInsertPayload(medicamento);

    const { error } = await supabase.from(this.tableName).insert(payload);

    if (error) {
      throw new Error(`Falha ao cadastrar medicamento: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Medicamento | null> {
    const numericId = this.toNumericId(id);

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', numericId)
      .maybeSingle<MedicamentoRow>();

    if (error) {
      throw new Error(`Falha ao buscar medicamento: ${error.message}`);
    }

    return data ? this.mapRowToDomain(data) : null;
  }

  async findAll(): Promise<Medicamento[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Falha ao listar medicamentos: ${error.message}`);
    }

    return (data ?? []).map((row) => this.mapRowToDomain(row as MedicamentoRow));
  }

  async update(medicamento: Medicamento): Promise<void> {
    const numericId = this.toNumericId(medicamento.id);
    const payload = this.buildUpdatePayload(medicamento);

    const { error } = await supabase
      .from(this.tableName)
      .update(payload)
      .eq('id', numericId);

    if (error) {
      throw new Error(`Falha ao atualizar medicamento: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const numericId = this.toNumericId(id);

    const { error } = await supabase.from(this.tableName).delete().eq('id', numericId);

    if (error) {
      throw new Error(`Falha ao excluir medicamento: ${error.message}`);
    }
  }

  private buildInsertPayload(medicamento: Medicamento): MedicamentoInsertPayload {
    return {
      user_id: medicamento.usuarioId,
      nome: medicamento.nome,
      dosagem: medicamento.dosagem,
      horario: medicamento.horario,
      frequencia: medicamento.frequencia,
      quantidadeConsumida: this.formatNumber(medicamento.quantidadeConsumida),
      quantidadeTotal: this.formatNumber(medicamento.quantidadeTotal),
      dosesDia: medicamento.dosesDia ?? null,
      fotoUri: medicamento.fotoUri ?? null,
    };
  }

  private buildUpdatePayload(medicamento: Medicamento): MedicamentoUpdatePayload {
    const payload: MedicamentoUpdatePayload = {};

    if (medicamento.nome !== undefined) {
      payload.nome = medicamento.nome;
    }

    if (medicamento.dosagem !== undefined) {
      payload.dosagem = medicamento.dosagem;
    }

    if (medicamento.horario !== undefined) {
      payload.horario = medicamento.horario;
    }

    if (medicamento.frequencia !== undefined) {
      payload.frequencia = medicamento.frequencia;
    }

    if (medicamento.quantidadeConsumida !== undefined) {
      payload.quantidadeConsumida = this.formatNumber(medicamento.quantidadeConsumida);
    }

    if (medicamento.quantidadeTotal !== undefined) {
      payload.quantidadeTotal = this.formatNumber(medicamento.quantidadeTotal);
    }

    if (medicamento.dosesDia !== undefined) {
      payload.dosesDia = medicamento.dosesDia ?? null;
    }

    if (medicamento.fotoUri !== undefined) {
      payload.fotoUri = medicamento.fotoUri ?? null;
    }

    return payload;
  }

  private mapRowToDomain(row: MedicamentoRow): Medicamento {
    return {
      id: String(row.id),
      usuarioId: row.user_id,
      nome: row.nome ?? '',
      dosagem: row.dosagem ?? '',
      horario: row.horario ?? '',
      frequencia: row.frequencia ?? '',
      quantidadeConsumida: this.parseNumber(row.quantidadeConsumida),
      quantidadeTotal: this.parseNumber(row.quantidadeTotal),
      dosesDia: row.dosesDia ?? undefined,
      cor: '#ffffffff',
      fotoUri: row.fotoUri ?? undefined,
      createdAt: row.created_at,
    };
  }

  private toNumericId(id: string): number {
    const parsed = Number(id);

    if (!Number.isFinite(parsed)) {
      throw new Error('Identificador de medicamento invalido.');
    }

    return parsed;
  }

  private parseNumber(value: string | null): number {
    if (value === null || value === undefined) {
      return 0;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private formatNumber(value: number): string {
    if (!Number.isFinite(value)) {
      return '0';
    }

    return String(value);
  }
}
