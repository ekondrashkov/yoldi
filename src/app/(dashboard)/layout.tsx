import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Yoldi | Dashboard",
  description: "Next level digital solutions",
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
