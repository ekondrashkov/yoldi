export enum LoginInputs {
  Email = "email",
  Password = "password",
}

import { z } from "zod"

export const loginFormSchema = z.object({
  [LoginInputs.Email]: z
    .string()
    .min(1, { message: "Заполните Email" })
    .max(60, { message: "Email не может быть больше 60 символов" })
    .email({ message: "Не корректный Email" }),
  [LoginInputs.Password]: z.string().min(1, { message: "Заполните пароль" }),
})

export type LoginSchemaProps = z.infer<typeof loginFormSchema>
