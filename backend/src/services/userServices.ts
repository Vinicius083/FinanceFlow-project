import { PrismaClient } from "../generated/prisma";
import { userValidation } from "../utils/userUtils";

const prisma = new PrismaClient();

const userServices = {
  getUserById: async (id: number) => {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  getUserByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  createUser: async (name: string, email: string, password: string) => {
    const validation = await userValidation(name, email, password);
    if (validation instanceof Error) {
      throw validation;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    if (!user) throw new Error("Failed to create user");

    return user;
  },

  updateUser: async (id: number, data: any) => {
    const validation = userValidation(data.name, data.email, data.password);
    if (validation instanceof Error) {
      throw validation;
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  deleteUser: async (id: number) => {
    const user = await prisma.user.delete({
      where: { id },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
};

export default userServices;
