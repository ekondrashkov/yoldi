export enum EditInputs {
  Name = "name",
  Url = "url",
  Description = "description",
}

import { z } from "zod"

export const editFormSchema = z.object({
  [EditInputs.Name]: z
    .string()
    .min(1, { message: "Имя не может быть пустым" })
    .max(40, { message: "Имя не может быть больше 40 символов" }),
  [EditInputs.Url]: z
    .string()
    .min(4, { message: "ID не может быть короче 4 символов" })
    .max(40, { message: "ID не может быть больше 40 символов" }),
  [EditInputs.Description]: z
    .string()
    .max(500, { message: "Описание не может быть больше 500 символов" }),
})

export type EditSchemaProps = z.infer<typeof editFormSchema>
