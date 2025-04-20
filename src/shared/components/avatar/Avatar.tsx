"use client"

import { useSWRConfig } from "swr"
import Image from "next/image"
import { getInitials } from "@/shared/utils/utils"
import { getUrl } from "@/shared/utils/utils"
import type { User } from "@/types/types"
import styles from "./avatar.module.scss"

const MAX_IMAGE_FILE_SIZE = 1024 * 1024 * 2

interface AvatarProps {
  user: User | null
  isCurrentUser: boolean
  isLoading: boolean
  setError: (text: string | null) => void
}

export const Avatar = ({
  user,
  isCurrentUser,
  isLoading,
  setError,
}: AvatarProps) => {
  const { mutate } = useSWRConfig()

  const onUploadClicked = async () => {
    if (!user) return
    setError(null)

    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async () => {
      if (!input.files) return
      const file = input.files[0]

      if (!file) return
      if (file.size > MAX_IMAGE_FILE_SIZE) {
        setError("Размер файла не должен превышать 2 МБ")
        return
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "yoldi-avatar")

      try {
        const response = await fetch(`${getUrl()}/api/image`, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const { message } = await response.json()
          setError(message)
          return
        }

        mutate("/api/profile")
        mutate(`/api/user/${user.slug}`)
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Не удалось загрузить изображение"
        )
      }
    }
    input.click()
  }

  return (
    <div
      className={
        isCurrentUser
          ? `${styles.avatarCurrent} ${styles.avatar}`
          : styles.avatar
      }
    >
      {isLoading || !user ? (
        ""
      ) : user.image ? (
        <Image
          src={user.image.url}
          alt="Avatar"
          width={user.image.width ? Number(user.image.width) : 100}
          height={user.image.height ? Number(user.image.height) : 100}
          className={styles.image}
        />
      ) : (
        <>
          <div className={styles.initials}>{getInitials(user.name ?? "")}</div>
          {isCurrentUser && (
            <button className={styles.upload} onClick={onUploadClicked} />
          )}
        </>
      )}
    </div>
  )
}
