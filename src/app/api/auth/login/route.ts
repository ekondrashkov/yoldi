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
      return new Response(JSON.stringify({ message: "Please fill email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const email = options.email.toLowerCase()

    const response = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (!response) {
      return new Response(
        JSON.stringify({ message: "User with this email doesn't exist" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    if (response.password !== options.password) {
      return new Response(JSON.stringify({ message: "Invalid password" }), {
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
    const message = error instanceof Error ? error.message : "Sign in error"

    return new Response(JSON.stringify({ message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
