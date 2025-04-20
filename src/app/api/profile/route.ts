import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import type { User, UserAvatar } from "@/types/types"

export async function GET() {
  try {
    const auth = await getServerSession()
    if (!auth || !auth.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        email: auth.user.email,
      },
      include: {
        image: true,
      },
    })

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const images = user.image ?? []
    const imagesMap: UserAvatar[] = images.map((image) => ({
      id: image.id,
      url: image.url,
      width: image.width,
      height: image.height,
    }))

    const response: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      slug: user.slug,
      description: user.description ?? undefined,
      image: imagesMap.length > 0 ? imagesMap[0] : undefined,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server Error"

    return new Response(JSON.stringify({ message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

interface PatchProfileRequest {
  id: number
  name?: string
  url?: string
  description?: string
}

export async function PATCH(request: Request) {
  try {
    const options = (await request.json()) as PatchProfileRequest
    if (!options.id) {
      return new Response(JSON.stringify({ message: "Неверный id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (options.url) {
      const existingUser = await prisma.user.findUnique({
        where: {
          slug: options.url,
        },
      })

      if (existingUser) {
        return new Response(
          JSON.stringify({
            message: `Пользователь с ID ${options.url} уже существует`,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        )
      }
    }

    const user = await prisma.user.update({
      where: {
        id: options.id,
      },
      data: {
        name: options.name,
        slug: options.url,
        description: options.description,
      },
    })

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Ошибка обновления данных" }),
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
      description: user.description ?? undefined,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
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
