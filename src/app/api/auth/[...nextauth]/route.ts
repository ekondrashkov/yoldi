import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
          const response = await fetch(`http://localhost:3000/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email,
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
          throw error instanceof Error ? error : new Error("Ошибка авторизации")
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
})

export { handler as GET, handler as POST }
