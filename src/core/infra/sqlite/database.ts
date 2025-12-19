import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

let databasePromise: Promise<SQLiteDatabase> | null = null;

async function migrate(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS medicamentos (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      nome TEXT,
      dosagem TEXT,
      horario TEXT,
      frequencia TEXT,
      quantidadeConsumida TEXT,
      quantidadeTotal TEXT,
      dosesDia TEXT,
      fotoUri TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_medicamentos_user_id_created_at
      ON medicamentos(user_id, created_at DESC);
  `);
}

export async function getDatabase(): Promise<SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = (async () => {
      const db = await openDatabaseAsync('app.db');
      await migrate(db);
      return db;
    })();
  }

  return databasePromise;
}

