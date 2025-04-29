"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/swr"
import { Container } from "@/shared/components/container/Container"
import { UserItem } from "@/shared/components/userItem/UserItem"
import { AccountsSceleton } from "@/shared/components/accoutsSceleton/AccountsSceleton"
import type { User } from "@/types/types"
import styles from "./page.module.scss"

// refresh every 5 minutes to get the latest data
const REFRESH_INTERVAL = 1000 * 60 * 5

export default function Accounts() {
  const { data, error, isLoading } = useSWR<User[]>("/api/user", fetcher, {
    refreshInterval: REFRESH_INTERVAL,
  })

  return (
    <Container>
      <div className={styles.accounts}>
        <h2 className={styles.title}>{"Accounts"}</h2>
        {isLoading ? (
          <AccountsSceleton />
        ) : error ? (
          <div className={styles.error}>{error.message}</div>
        ) : (
          <ul className={styles.list}>
            {data &&
              data.length > 0 &&
              data.map((user: User) => <UserItem key={user.id} {...user} />)}
          </ul>
        )}
      </div>
    </Container>
  )
}
