import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUrl } from "@/shared/utils/utils"

const handler = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }

        const { email, password } = credentials

        try {
          const response = await fetch(`${getUrl()}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: email.toLowerCase(),
              password,
            }),
          })
          const user = await response.json()

          if (!user.id || !user.email) {
            return null
          }

          return user
        } catch (error) {
          console.error(error)
          throw error instanceof Error ? error : new Error("Auth error")
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
})

export { handler as GET, handler as POST }
