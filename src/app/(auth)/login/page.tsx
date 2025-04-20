"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { LoginForm } from "@/shared/components/loginForm/LoginForm"
import styles from "./page.module.scss"
import { Suspense } from "react"

export default function Login() {
  const { data: session } = useSession()

  if (session) {
    redirect("/accounts")
  }

  return (
    <div className={styles.background}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
