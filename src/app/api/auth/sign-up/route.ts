import prisma from "@/lib/prisma"
import { User } from "@/types/types"

interface SignupUserRequest {
  name: string
  email: string
  password: string
}

export async function POST(request: Request) {
  try {
    const options = (await request.json()) as SignupUserRequest
    if (!options.email || !options.password || !options.name) {
      return new Response(JSON.stringify({ message: "Заполните все поля" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const email = options.email.toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: "Пользователь с таким email уже существует",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const user = await prisma.user.create({
      data: {
        name: options.name,
        email: email,
        password: options.password,
      },
    })

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Ошибка при регистрации" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const response: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      slug: user.slug,
    }

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка сервера"

    return new Response(JSON.stringify({ message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
