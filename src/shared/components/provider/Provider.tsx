"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>
}
