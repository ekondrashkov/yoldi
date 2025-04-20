import prisma from "@/lib/prisma"
import { User } from "@/types/types"

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: Request) {
  try {
    const options = (await request.json()) as LoginRequest
    if (!options.email) {
      return new Response(JSON.stringify({ message: "Нет email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const response = await prisma.user.findUnique({
      where: {
        email: options.email,
      },
    })

    if (!response) {
      return new Response(
        JSON.stringify({ message: "Пользователь не найден" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    if (response.password !== options.password) {
      return new Response(JSON.stringify({ message: "Неверный пароль" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const user: User = {
      id: response.id,
      name: response.name,
      email: response.email,
      slug: response.slug,
      description: response.description ?? undefined,
    }

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ошибка авторизации"

    return new Response(JSON.stringify({ message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
