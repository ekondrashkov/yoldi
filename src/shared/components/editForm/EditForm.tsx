"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useSWRConfig } from "swr"
import { DialogButton } from "../dialogButton/DialogButton"
import type { User } from "@/types/types"
import { editFormSchema, EditInputs, EditSchemaProps } from "./schema"
import styles from "./editform.module.scss"

interface EditFormProps {
  user: Readonly<User>
  onCancel: () => void
}

export const EditForm = ({ user, onCancel }: EditFormProps) => {
  const [isPending, setPending] = useState(false)
  const router = useRouter()
  const { mutate } = useSWRConfig()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<EditSchemaProps>({
    resolver: zodResolver(editFormSchema),
  })

  const onSubmit = async () => {
    if (isPending) return

    const { name, url, description } = getValues()
    const validated = editFormSchema.safeParse({ name, url, description })
    if (!validated.success) {
      return
    }

    if (
      name === user.name &&
      url === user.slug &&
      description === user.description
    ) {
      onCancel()
    }

    try {
      setPending(true)
      const response = await fetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          id: user.id,
          name: name === user.name ? undefined : name,
          url: url === user.slug ? undefined : url,
          description:
            description === user.description ? undefined : description,
        }),
      })
      const updatedUser = await response.json()

      if (updatedUser) {
        mutate("/api/profile")
        if (updatedUser.slug === user.slug) {
          mutate(`/api/user/${user.slug}`)
        }
        router.push(`/accounts/${updatedUser.slug}`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setPending(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Редактировать профиль</h2>
      <label className={styles.labelWrapper} htmlFor={EditInputs.Name}>
        <span className={styles.label}>{"Имя"}</span>
        <input
          className={styles.input}
          type="text"
          defaultValue={user.name}
          id={EditInputs.Name}
          disabled={isPending}
          {...register(EditInputs.Name)}
        />
        {<p className={styles.error}>{errors?.name?.message ?? ""}</p>}
      </label>
      <label className={styles.labelWrapper} htmlFor={EditInputs.Url}>
        <span className={styles.label}>{"Адрес профиля"}</span>
        <div className={styles.urlInput}>
          <div className={styles.domain}>{"example.com/"}</div>
          <input
            className={styles.input}
            type="text"
            defaultValue={user.slug}
            id={EditInputs.Url}
            disabled={isPending}
            {...register(EditInputs.Url)}
          />
        </div>
        {<p className={styles.error}>{errors?.url?.message ?? ""}</p>}
      </label>
      <label
        className={`${styles.labelWrapper} ${styles.labelWrapperTextArea}`}
        htmlFor={EditInputs.Description}
      >
        <span className={styles.label}>{"Описание"}</span>
        <textarea
          className={styles.textArea}
          defaultValue={user.description ?? ""}
          id={EditInputs.Description}
          disabled={isPending}
          {...register(EditInputs.Description)}
        />
        {<p className={styles.error}>{errors?.description?.message ?? ""}</p>}
      </label>
      <div className={styles.buttonsBar}>
        <DialogButton
          colorType="light"
          disabled={isPending}
          type="button"
          text="Отмена"
          onClick={onCancel}
        />
        <DialogButton
          colorType="dark"
          disabled={isPending}
          type="submit"
          text="Сохранить"
          onClick={onSubmit}
        />
      </div>
    </form>
  )
}
