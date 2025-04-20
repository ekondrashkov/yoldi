"use client"

import { Container } from "@/shared/components/container/Container"
import { usePathname } from "next/navigation"
import Link from "next/link"
import styles from "./footer.module.scss"

export const Footer = () => {
  const pathname = usePathname()
  const isRegisterPage = pathname.includes("register")

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.content}>
          <span className={styles.text}>
            {isRegisterPage ? "Уже есть аккаунт?" : "Eщё нет аккаунта?"}
          </span>
          <Link
            href={isRegisterPage ? "/login" : "/register"}
            className={styles.link}
          >
            {isRegisterPage ? "Войти" : "Зарегистрироваться"}
          </Link>
        </div>
      </Container>
    </footer>
  )
}
