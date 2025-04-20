"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/shared/components/button/Button"
import styles from "./page.module.scss"

export default function NotFound() {
  const pathname = usePathname()

  return (
    <div className={styles.wrapper}>
      <div className={styles.notFound}>
        <h2 className={styles.title}>{"404"}</h2>
        <p className={styles.text}>
          Страница <b>{pathname}</b> не найдена
        </p>
        <Button link="/" text="На главную" />
      </div>
    </div>
  )
}
