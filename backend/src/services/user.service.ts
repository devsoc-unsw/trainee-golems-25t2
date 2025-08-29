import { prisma } from "../lib/prisma";

export async function createUser(
  email: string,
  name: string,
  password: string,
  avatar?: string
) {
  return await prisma.user.create({
    data: {
      email,
      name,
      password,
      avatar,
    },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string }
) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany();
}
