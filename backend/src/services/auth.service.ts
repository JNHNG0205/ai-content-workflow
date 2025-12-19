import { randomUUID } from "crypto";
import { prisma } from "../config/prisma";
import { redis } from "../config/redis";
import { hashPassword, verifyPassword } from "../utils/password";
import { addDays } from "../utils/time";
import { Role } from "../generated/prisma";

const SESSION_EXPIRATION_TIME = 60 * 60 * 24; // 1 day

export async function register(email: string, password: string, role?: Role) {
  const normalizedEmail = email.toLowerCase();
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { 
      email: normalizedEmail, 
      password: hashedPassword, 
      ...(role && { role })
    },
    select: { id: true, email: true, role: true },
  });
  return user;
};

export async function login(email: string, password: string) {
  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user) {
    throw new Error("Invalid credentials");
  }
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const sessionId = randomUUID();
  const expiresAt = addDays(new Date(), 1);

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      expiresAt,
    },
  });
  
  await redis.set(
    `session:${sessionId}`, 
    JSON.stringify({ userId: user.id, role: user.role }), 
    "EX", 
    SESSION_EXPIRATION_TIME);

  return { 
    sessionId, 
    user: {
        id: user.id,
        email: user.email,
        role: user.role,
    }, 
  };
};