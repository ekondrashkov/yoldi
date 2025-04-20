import { Cover, Image } from "@/app/generated/prisma"

export interface User {
  id: number
  name: string
  email: string
  slug: string
  description?: string
  image?: UserAvatar
  cover?: UserCover
}

export type UserAvatar = Omit<Image, "userId">
export type UserCover = Omit<Cover, "userId">

export interface CloudinaryUploadResponse {
  acces_model?: string
  asset_id?: string
  public_id?: string
  version?: number
  version_id?: string
  signature?: string
  width?: number
  height?: number
  format?: string
  resource_type?: string
  created_at?: string
  tags?: string[]
  bytes?: number
  type?: string
  etag?: string
  placeholder?: boolean
  url?: string
  secure_url?: string
  original_filename?: string
  original_extension?: string
}
