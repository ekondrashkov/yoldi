import prisma from "@/lib/prisma"
import { User, UserAvatar, UserCover } from "@/types/types"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const user = await prisma.user.findUnique({
      where: {
        slug: slug,
      },
      include: {
        image: true,
        cover: true,
      },
    })

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found", status: 404 }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const images = user.image ?? []
    const imagesMap: UserAvatar[] = images.map((image) => ({
      id: image.id,
      url: image.url,
      width: image.width,
      height: image.height,
    }))

    const covers = user.cover ?? []
    const coversMap: UserCover[] = covers.map((image) => ({
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
      cover: coversMap.length > 0 ? coversMap[0] : undefined,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error"

    return new Response(JSON.stringify({ message, status: 500 }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
