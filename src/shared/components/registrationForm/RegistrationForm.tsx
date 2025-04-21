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
  const [disabled, setDisabled] = useState(true)
  const router = useRouter()

  const timeoutId: NodeJS.Timeout | null = null

  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<RegistrationSchemaProps>({
    resolver: zodResolver(registrationFormSchema),
  })

  /**
   * Set initial focus on name input
   */
  useEffect(() => {
    setFocus(RegistrationInputs.Name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*
   * Update submit button state on input with 300ms delay
   * disabled - if any input is empty
   */
  const onInput = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    setTimeout(() => {
      const { email, password } = getValues()
      setDisabled(!email || !password)
    }, 300)
  }

  /**
   * Handles the registration process when the user submits the form.
   *
   * - Validates the name, email, and password inputs using the registrationFormSchema.
   * - If validation is successful, sends a POST request to the sign-up API endpoint.
   * - On successful registration, redirects the user to the login page.
   * - Displays an error message if the registration process fails.
   * - Manages the pending and disabled state to prevent multiple submissions.
   */
  const onSubmit = async () => {
    if (isPending || disabled) return

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
            onInput={onInput}
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
            onInput={onInput}
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
            onInput={onInput}
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
        disabled={isPending || disabled}
        colorType="dark"
        onClick={onSubmit}
      />
    </form>
  )
}
