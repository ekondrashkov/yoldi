export enum RegistrationInputs {
  Name = "name",
  Email = "email",
  Password = "password",
}

import { z } from "zod"

export const registrationFormSchema = z.object({
  [RegistrationInputs.Name]: z
    .string()
    .min(1, { message: "Заполните имя" })
    .max(60, { message: "Имя не может быть больше 60 символов" }),
  [RegistrationInputs.Email]: z
    .string()
    .min(1, { message: "Заполните Email" })
    .max(60, { message: "Email не может быть больше 60 символов" })
    .email({ message: "Не корректный Email" }),
  [RegistrationInputs.Password]: z
    .string()
    .min(4, { message: "Пароль должен быть не менее 4 символов" }),
})

export type RegistrationSchemaProps = z.infer<typeof registrationFormSchema>
