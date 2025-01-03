import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GarupaPay",
  description: "Movimentar o dinheiro ficou tão fácil quanto movimentar você de Garupa!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#1E0B38]`}>{children}</body>
    </html>
  )
}