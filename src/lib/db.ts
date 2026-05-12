'use client'

import type { Database, Statement } from 'sql.js'
import { SEED_SQL } from '@/data/seed'

let db: Database | null = null

export async function initDB(): Promise<void> {
  if (db) return
  const initSqlJs = (await import('sql.js')).default
  const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
  db = new SQL.Database()
  db.run(SEED_SQL)
}

export function runQuery(query: string): { columns: string[]; rows: any[][] } {
  if (!db) throw new Error('Database not initialized — call initDB() first')

  let stmt: Statement | null = null
  try {
    stmt = db.prepare(query)
    const columns = stmt.getColumnNames()
    const rows: any[][] = []
    while (stmt.step()) {
      rows.push(stmt.get() as any[])
    }
    return { columns, rows }
  } finally {
    stmt?.free()
  }
}

export function resetDB(): void {
  if (db) {
    db.close()
    db = null
  }
}
