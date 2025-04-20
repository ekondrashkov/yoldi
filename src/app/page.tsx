"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import styles from "./page.module.scss"

export default function Home() {
  const { data: session, status } = useSession()
  if (status !== "loading") {
    if (!session) {
      redirect("/register")
    } else {
      redirect("/accounts")
    }
  }

  return <main className={styles.main} />
}
