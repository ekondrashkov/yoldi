import { Footer } from "@/shared/components/footer/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Yoldi | Авторизация",
  description: "Разрабатываем и запускаем сложные веб проекты",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <main className="main">{children}</main>
      <Footer />
    </>
  )
}
