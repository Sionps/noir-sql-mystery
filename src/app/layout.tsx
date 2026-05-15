import type { Metadata } from 'next'
import { Special_Elite, Courier_Prime, Charmonman } from 'next/font/google'
import './globals.css'

const specialElite = Special_Elite({ weight: '400', subsets: ['latin'], variable: '--font-special-elite' })
const courierPrime = Courier_Prime({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-courier-prime' })
const charmonman = Charmonman({ weight: ['400', '700'], subsets: ['thai', 'latin'], variable: '--font-charmonman' })

export const metadata: Metadata = {
  title: 'Dead on Arrival — A SQL Murder Mystery',
  description: 'A noir detective game powered by SQL. 1947. Ten clues. One killer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${specialElite.variable} ${courierPrime.variable} ${charmonman.variable}`}>
      <body className="bg-surface text-aged font-mono">{children}</body>
    </html>
  )
}
