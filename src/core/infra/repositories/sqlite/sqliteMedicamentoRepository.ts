import type { IMedicamentoRepository } from '../../../domain/repositories/IMedicamentoRepository';
import type { Medicamento } from '../../../domain/entities/Medicamento';
import { getDatabase } from '../../sqlite/database';

type MedicamentoRow = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  nome: string | null;
  dosagem: string | null;
  horario: string | null;
  frequencia: string | null;
  quantidadeConsumida: string | null;
  quantidadeTotal: string | null;
  dosesDia: string | null;
  fotoUri: string | null;
};

function nowIso(): string {
  return new Date().toISOString();
}

function toTextNumber(value: number | undefined): string {
  if (!Number.isFinite(value)) {
    return '0';
  }
  return String(value);
}

function toNumber(value: string | null): number {
  if (value === null) {
    return 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export class SQLiteMedicamentoRepository implements IMedicamentoRepository {
  constructor(private readonly userId: string) {}

  async save(medicamento: Medicamento): Promise<void> {
    const db = await getDatabase();
    const timestamp = nowIso();
    const createdAt = medicamento.createdAt ?? timestamp;
    const updatedAt = timestamp;

    await db.runAsync(
      `INSERT INTO medicamentos (
        id, user_id, created_at, updated_at, nome, dosagem, horario, frequencia,
        quantidadeConsumida, quantidadeTotal, dosesDia, fotoUri
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        updated_at=excluded.updated_at,
        nome=excluded.nome,
        dosagem=excluded.dosagem,
        horario=excluded.horario,
        frequencia=excluded.frequencia,
        quantidadeConsumida=excluded.quantidadeConsumida,
        quantidadeTotal=excluded.quantidadeTotal,
        dosesDia=excluded.dosesDia,
        fotoUri=excluded.fotoUri`,
      [
        medicamento.id,
        this.userId,
        createdAt,
        updatedAt,
        medicamento.nome ?? null,
        medicamento.dosagem ?? null,
        medicamento.horario ?? null,
        medicamento.frequencia ?? null,
        toTextNumber(medicamento.quantidadeConsumida),
        toTextNumber(medicamento.quantidadeTotal),
        medicamento.dosesDia ?? null,
        medicamento.fotoUri ?? null,
      ]
    );
  }

  async findById(id: string): Promise<Medicamento | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<MedicamentoRow>(
      `SELECT * FROM medicamentos WHERE id = ? AND user_id = ? LIMIT 1`,
      [id, this.userId]
    );

    if (!row) {
      return null;
    }

    return this.mapRowToDomain(row);
  }

  async findAll(): Promise<Medicamento[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<MedicamentoRow>(
      `SELECT * FROM medicamentos WHERE user_id = ? ORDER BY created_at DESC`,
      [this.userId]
    );
    return rows.map((row) => this.mapRowToDomain(row));
  }

  async update(medicamento: Medicamento): Promise<void> {
    const db = await getDatabase();
    const updatedAt = nowIso();

    await db.runAsync(
      `UPDATE medicamentos SET
        updated_at = ?,
        nome = ?,
        dosagem = ?,
        horario = ?,
        frequencia = ?,
        quantidadeConsumida = ?,
        quantidadeTotal = ?,
        dosesDia = ?,
        fotoUri = ?
      WHERE id = ? AND user_id = ?`,
      [
        updatedAt,
        medicamento.nome ?? null,
        medicamento.dosagem ?? null,
        medicamento.horario ?? null,
        medicamento.frequencia ?? null,
        toTextNumber(medicamento.quantidadeConsumida),
        toTextNumber(medicamento.quantidadeTotal),
        medicamento.dosesDia ?? null,
        medicamento.fotoUri ?? null,
        medicamento.id,
        this.userId,
      ]
    );
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`DELETE FROM medicamentos WHERE id = ? AND user_id = ?`, [id, this.userId]);
  }

  private mapRowToDomain(row: MedicamentoRow): Medicamento {
    return {
      id: row.id,
      usuarioId: row.user_id,
      nome: row.nome ?? '',
      dosagem: row.dosagem ?? '',
      horario: row.horario ?? '',
      frequencia: row.frequencia ?? '',
      quantidadeConsumida: toNumber(row.quantidadeConsumida),
      quantidadeTotal: toNumber(row.quantidadeTotal),
      dosesDia: row.dosesDia ?? undefined,
      cor: '#ffffffff',
      fotoUri: row.fotoUri ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

