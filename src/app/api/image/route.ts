import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { Cover, User } from "@/app/generated/prisma"
import { getCloudinaryName } from "@/shared/utils/utils"
import type { CloudinaryUploadResponse } from "@/types/types"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const auth = await getServerSession()
  if (!auth || !auth.user?.email) {
    return new Response(JSON.stringify({ message: "Auth error" }), {
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

  const formData = await req.formData()
  const preset = formData.get("upload_preset")

  try {
    const imageDataResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${getCloudinaryName()}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!imageDataResponse.ok) {
      return new Response(JSON.stringify({ message: "Upload error" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
    const imageData =
      (await imageDataResponse.json()) as CloudinaryUploadResponse

    if (!imageData.secure_url && !imageData.url) {
      return new Response(JSON.stringify({ message: "Upload error" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    let image: Cover | User | null = null
    if (preset === "yoldi-cover") {
      image = await prisma.cover.create({
        data: {
          url: (imageData.secure_url || imageData.url)!,
          width: imageData.width ? String(imageData.width) : undefined,
          height: imageData.height ? String(imageData.height) : undefined,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      })
    } else {
      image = await prisma.image.create({
        data: {
          url: (imageData.secure_url || imageData.url)!,
          width: imageData.width ? String(imageData.width) : undefined,
          height: imageData.height ? String(imageData.height) : undefined,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      })
    }

    if (!image) {
      return new Response(JSON.stringify({ message: "Upload error" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(
      JSON.stringify({
        url: image.url,
        width: image.width,
        height: image.height,
        userId: image.userId,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error(error)
    throw error instanceof Error ? error : new Error("Upload error")
  }
}
