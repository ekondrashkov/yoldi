"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { getErrorText, getUrl } from "@/shared/utils/utils"
import Image from "next/image"
import { DialogButton } from "../dialogButton/DialogButton"
import { loginFormSchema, LoginInputs, LoginSchemaProps } from "./schema"
import styles from "./loginform.module.scss"

export const LoginForm = () => {
  const [isPending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const params = useSearchParams()
  const errorValue = params.get("error")

  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<LoginSchemaProps>({
    resolver: zodResolver(loginFormSchema),
  })

  useEffect(() => {
    setFocus(LoginInputs.Email)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onLogin = async () => {
    if (isPending) return

    const { email, password } = getValues()
    const validated = loginFormSchema.safeParse({
      email,
      password,
    })

    if (!validated.success) {
      return
    }

    try {
      setPending(true)
      setError(null)

      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: `${getUrl()}/accounts`,
      })
    } catch (error) {
      console.log(error)
      setError(error instanceof Error ? error.message : "Ошибка авторизации")
    } finally {
      setPending(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onLogin)}>
      <h2 className={styles.title}>{"Вход в Yoldi Agency"}</h2>

      <div className={styles.inputs}>
        <label className={styles.label} htmlFor={LoginInputs.Email}>
          <Image
            className={styles.icon}
            src="/email.svg"
            alt="Email icon"
            width={25}
            height={25}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="E-mail"
            id={LoginInputs.Email}
            disabled={isPending}
            {...register(LoginInputs.Email)}
          />
          <p className={styles.error}>{errors?.email?.message ?? ""}</p>
        </label>
        <label className={styles.label} htmlFor={LoginInputs.Password}>
          <Image
            className={styles.icon}
            src="/password.svg"
            alt="Password icon"
            width={25}
            height={25}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Пароль"
            id={LoginInputs.Password}
            disabled={isPending}
            {...register(LoginInputs.Password)}
          />
          <p className={styles.error}>{errors?.password?.message ?? ""}</p>
        </label>
      </div>

      {(errorValue || error) && (
        <p className={styles.error}>
          {errorValue ? getErrorText(errorValue) : error}
        </p>
      )}

      <DialogButton
        type="submit"
        text="Войти"
        disabled={isPending}
        colorType="dark"
        onClick={onLogin}
      />
    </form>
  )
}
