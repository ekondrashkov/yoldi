import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Header } from "@/shared/components/header/Header"
import { Providers } from "@/shared/components/provider/Provider"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
})

export const metadata: Metadata = {
  title: "Yoldi",
  description: "Разрабатываем и запускаем сложные веб проекты",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
