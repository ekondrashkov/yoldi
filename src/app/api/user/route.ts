import prisma from "@/lib/prisma"
import { User } from "@/types/types"

export async function GET() {
  try {
    const users =
      (await prisma.user.findMany({
        include: {
          image: true,
        },
      })) ?? []

    const response: User[] = users
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        slug: user.slug,
        description: user.description ?? undefined,
        image: user?.image[0] ?? undefined,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error"

    return new Response(JSON.stringify({ message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
