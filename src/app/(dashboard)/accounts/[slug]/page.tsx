"use client"

import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import useSWR from "swr"
import { fetcher } from "@/lib/swr"
import { Container } from "@/shared/components/container/Container"
import { Button } from "@/shared/components/button/Button"
import { Avatar } from "@/shared/components/avatar/Avatar"
import { ProfileSceleton } from "@/shared/components/profileSceleton/ProfileSceleton"
import { AccountCover } from "@/shared/components/accountCover/AccountCover"
import { getSession, signOut } from "next-auth/react"
import type { CustomError, User } from "@/types/types"
import styles from "./page.module.scss"

export default function User({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { data, error, isLoading } = useSWR<User | CustomError>(
    `/api/user/${slug}`,
    fetcher
  )
  const [isCurrentUser, SetIsCurrentUser] = useState(false)
  const [userData, setUserData] = useState<User | null>(null)
  const [errorText, setErrorText] = useState<string | null>(null)

  const getUserData = (): User | null => {
    if (data && "email" in data) {
      return data
    }
    return null
  }

  useEffect(() => {
    if (data) {
      if ("email" in data) {
        getSession().then((session) => {
          SetIsCurrentUser(session?.user?.email === data.email)
        })
        const user = getUserData()
        if (user) setUserData(user)
      } else {
        if (data.status === 404) notFound()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  const onSighOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <>
      <AccountCover
        user={userData}
        isCurrentUser={isCurrentUser}
        setError={setErrorText}
      />
      <Container>
        <div className={styles.content}>
          <Avatar
            user={userData}
            isCurrentUser={isCurrentUser}
            isLoading={isLoading}
            setError={setErrorText}
          />
          {(error || errorText) && (
            <div className={styles.error}>{error?.message || errorText}</div>
          )}
          {isLoading ? (
            <ProfileSceleton />
          ) : userData ? (
            <>
              <div className={styles.about}>
                <div className={styles.userInfo}>
                  <div className={styles.nameAndEmail}>
                    <h3 className={styles.name}>{userData.name}</h3>
                    <span className={styles.email}>{userData.email}</span>
                  </div>
                  {isCurrentUser && (
                    <Button
                      link={`/accounts/${userData.slug}/edit`}
                      text="Edit"
                      imageSrc="edit.svg"
                    />
                  )}
                </div>
                <p className={styles.bio}>{userData.description ?? ""}</p>
              </div>
              {isCurrentUser && (
                <Button
                  onClick={onSighOut}
                  text="Log Out"
                  imageSrc="exit.svg"
                />
              )}
            </>
          ) : null}
        </div>
      </Container>
    </>
  )
}
