import { PrismaClient, Prisma } from "../src/app/generated/prisma"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = Array.from({ length: 10 }, () => ({
  email: faker.internet.email().toLowerCase(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  description: faker.person.bio(),
}))

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u })
  }
}

main()
