"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { RegistrationForm } from "@/shared/components/registrationForm/RegistrationForm"
import styles from "./page.module.scss"

export default function Register() {
  const { data: session } = useSession()
  if (session) redirect("/accounts")

  return (
    <div className={styles.background}>
      <RegistrationForm />
    </div>
  )
}
