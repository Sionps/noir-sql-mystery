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

const BLOCKED = /^\s*(insert|update|delete|drop|create|alter|replace|truncate|attach|detach|pragma)\b/i

export function runQuery(query: string): { columns: string[]; rows: any[][] } {
  if (!db) throw new Error('Database not initialized — call initDB() first')
  if (BLOCKED.test(query)) throw new Error('Only SELECT queries are allowed')

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
