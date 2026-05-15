import { en } from './translations/en'
import { th } from './translations/th'

export const translations = {
  en,
  th,
} as const;

export type Language = keyof typeof translations;
