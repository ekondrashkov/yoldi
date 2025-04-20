"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { fetcher } from "@/lib/swr"
import { Profile } from "@/shared/components/profile/Profile"
import { Container } from "@/shared/components/container/Container"
import type { User } from "@/types/types"
import styles from "./header.module.scss"

export const Header = () => {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<User | null>(null)
  const { data } = useSWR<User | null>(`/api/profile`, fetcher)

  const getProfile = (): User | null | undefined => data

  useEffect(() => {
    if (session && session.user) {
      const user = getProfile()
      if (user) setUserData(user)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, data])

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.content}>
          <div className={styles.logoAndTitle}>
            <Link
              href={session ? "/accounts" : "/login"}
              className={styles.logo}
              aria-disabled={status === "loading"}
            >
              <Image
                className={styles.logoImg}
                src="/logo.svg"
                alt="Yoldi logo"
                width={64}
                height={18}
                priority
              />
            </Link>
            <h1 className={styles.title}>
              {`Разрабатываем и запускаем\nсложные веб проекты`}
            </h1>
          </div>
          {session && userData ? (
            <Profile user={userData} />
          ) : (
            status === "unauthenticated" && (
              <Link href="/login" className={styles.loginBtn}>
                {"Войти"}
              </Link>
            )
          )}
        </div>
      </Container>
    </header>
  )
}
