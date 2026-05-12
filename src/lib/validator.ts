import type { Level } from '@/data/levels'

export interface QueryResult {
  columns: string[]
  rows: any[][]
}

export interface ValidationResult {
  main: boolean
  bonus: boolean
}

export function validateResult(result: QueryResult, level: Level): ValidationResult {
  try {
    const main = level.validate(result.rows, result.columns)
    const bonus = level.bonus_validate(result.rows, result.columns)
    return { main, bonus }
  } catch {
    return { main: false, bonus: false }
  }
}
