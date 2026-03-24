import { prisma } from "./db";

export async function getUser() {
  const email = process.env.USER_EMAIL!;
  const name = process.env.USER_NAME || "User";

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, name, password: "" },
    });
  }
  return user;
}
