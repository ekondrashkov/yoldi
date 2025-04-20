import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Yoldi",
  description: "Разрабатываем и запускаем сложные веб проекты",
}

export default function DashboadrLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <main className="main">
      {children}
      {modal}
    </main>
  )
}
