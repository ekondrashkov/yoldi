export const getInitials = (name: string): string => {
  return name ? name[0].toUpperCase() : "NA"
}

export const getErrorText = (error: string): string => {
  switch (error) {
    case "CredentialsSignin":
      return "Invalid email or password"
    default:
      return error
  }
}

export const getUrl = (): string => {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_VERCEL_URL!
}

export const getCloudinaryName = (): string => {
  return process.env.CLOUDINARY_CLOUD_NAME!
}
