"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogButton } from "@/shared/components/dialogButton/DialogButton"
import {
  registrationFormSchema,
  RegistrationInputs,
  RegistrationSchemaProps,
} from "./schema"
import styles from "./registrationform.module.scss"

export const RegistrationForm = () => {
  const [isPending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPwdShown, setPwdShown] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<RegistrationSchemaProps>({
    resolver: zodResolver(registrationFormSchema),
  })

  useEffect(() => {
    setFocus(RegistrationInputs.Name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async () => {
    if (isPending) return

    const { name, email, password } = getValues()
    const validated = registrationFormSchema.safeParse({
      name,
      email,
      password,
    })
    if (!validated.success) {
      return
    }

    try {
      setPending(true)
      setError(null)

      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        router.push("/login")
      } else {
        const { message } = await response.json()
        setError(message ? (message as string) : "Ошибка регистрации")
      }
    } catch (error) {
      console.error(error)
      setError(error instanceof Error ? error.message : "Ошибка регистрации")
    } finally {
      setPending(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>{"Регистрация\nв Yoldi Agency"}</h2>

      <div className={styles.inputs}>
        <label className={styles.label} htmlFor={RegistrationInputs.Name}>
          <Image
            className={styles.icon}
            src="/user.svg"
            alt="Name icon"
            width={25}
            height={25}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="Имя"
            id={RegistrationInputs.Name}
            disabled={isPending}
            {...register(RegistrationInputs.Name)}
          />
          <p className={styles.error}>{errors?.name?.message ?? ""}</p>
        </label>
        <label className={styles.label} htmlFor={RegistrationInputs.Email}>
          <Image
            className={styles.icon}
            src="/email.svg"
            alt="Email icon"
            width={25}
            height={25}
          />
          <input
            type="email"
            className={styles.input}
            placeholder="E-mail"
            id={RegistrationInputs.Email}
            disabled={isPending}
            {...register(RegistrationInputs.Email)}
          />
          <p className={styles.error}>{errors?.email?.message ?? ""}</p>
        </label>
        <label className={styles.label} htmlFor={RegistrationInputs.Password}>
          <Image
            className={styles.icon}
            src="/password.svg"
            alt="Password icon"
            width={25}
            height={25}
          />
          <input
            type={isPwdShown ? "text" : "password"}
            className={styles.pwdInput}
            placeholder="Пароль"
            id={RegistrationInputs.Password}
            disabled={isPending}
            {...register(RegistrationInputs.Password)}
          />
          <button
            type="button"
            className={styles.showPwdBtn}
            onClick={() => setPwdShown(!isPwdShown)}
          >
            <Image
              className={styles.eyeIcon}
              src="/eye.svg"
              alt={isPwdShown ? "Скрыть пароль" : "Показать пароль"}
              width={25}
              height={25}
            />
          </button>

          <p className={styles.error}>{errors?.password?.message ?? ""}</p>
        </label>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <DialogButton
        type="submit"
        text="Создать аккаунт"
        disabled={isPending}
        colorType="dark"
        onClick={onSubmit}
      />
    </form>
  )
}
