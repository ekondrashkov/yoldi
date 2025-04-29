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
  const [disabled, setDisabled] = useState(true)
  const params = useSearchParams()
  const errorValue = params.get("error")

  const timeoutId: NodeJS.Timeout | null = null

  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<LoginSchemaProps>({
    resolver: zodResolver(loginFormSchema),
  })

  /**
   * Set initial focus on email input
   */
  useEffect(() => {
    setFocus(LoginInputs.Email)
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
   * Handles the login process when the user submits the form.
   *
   * - Validates the email and password inputs using the loginFormSchema.
   * - If validation is successful, attempts to sign in the user with credentials.
   * - Displays an error message if the sign-in process fails.
   * - Redirects to the accounts page upon successful login.
   * - Manages the pending and disabled state to prevent multiple submissions.
   */
  const onLogin = async () => {
    if (isPending || disabled) return

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
      setError(error instanceof Error ? error.message : "Authorization error")
    } finally {
      setPending(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onLogin)}>
      <h2 className={styles.title}>{"Sign In"}</h2>

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
            placeholder="Email"
            id={LoginInputs.Email}
            disabled={isPending}
            onInput={onInput}
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
            placeholder="Password"
            id={LoginInputs.Password}
            disabled={isPending}
            onInput={onInput}
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
        text="Sign In"
        disabled={isPending || disabled}
        colorType="dark"
        onClick={onLogin}
      />
    </form>
  )
}
