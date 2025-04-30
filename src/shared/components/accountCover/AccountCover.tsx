"use client"

import { useSWRConfig } from "swr"
import { Button } from "@/shared/components/button/Button"
import { getUrl } from "@/shared/utils/utils"
import type { User } from "@/types/types"
import styles from "./accountCover.module.scss"

const MAX_IMAGE_FILE_SIZE = 1024 * 1024 * 10

interface AccountCoverProps {
  user: User | null
  isCurrentUser: boolean
  setError: (text: string | null) => void
}

export const AccountCover = ({
  user,
  isCurrentUser,
  setError,
}: AccountCoverProps) => {
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
        setError("Image size should not exceed 10 MB")
        return
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "yoldi-cover")

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

        mutate(`/api/user/${user.slug}`)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not upload image")
      }
    }
    input.click()
  }
  return (
    <div
      className={styles.cover}
      style={
        user?.cover?.url ? { backgroundImage: `url(${user.cover.url})` } : {}
      }
    >
      {user && !user?.cover?.url && isCurrentUser && (
        <Button
          text="Upload"
          imageSrc="upload.svg"
          imageSecondSrc="image.svg"
          onClick={onUploadClicked}
        />
      )}
    </div>
  )
}
