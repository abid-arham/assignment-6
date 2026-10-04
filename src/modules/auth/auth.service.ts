import { Role } from "@prisma/client"
import { prisma } from "../../config/prisma.js"
import { AppError } from "../../utils/AppError.js"
import { hashPassword, comparePassword, hashToken } from "../../utils/hash.js"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js"

export const registerUser = async (input: { name: string; email: string; password: string }) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw new AppError(409, "An account with this email already exists")

  const passwordHash = await hashPassword(input.password)

  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash, role: "STUDENT" },
  })

  return issueTokenPair(user.id, user.role)
}

export const loginUser = async (input: { email: string; password: string }) => {
  const user = await prisma.user.findFirst({ where: { email: input.email, deletedAt: null } })
  if (!user || !user.passwordHash) throw new AppError(401, "Invalid email or password")

  const valid = await comparePassword(input.password, user.passwordHash)
  if (!valid) throw new AppError(401, "Invalid email or password")

  return issueTokenPair(user.id, user.role)
}

export const refreshAccessToken = async (refreshToken: string) => {
  let payload: { id: string }
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    throw new AppError(401, "Invalid or expired refresh token")
  }

  const tokenHash = hashToken(refreshToken)
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } })
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new AppError(401, "Refresh token is no longer valid")
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } })
  if (!user) throw new AppError(401, "User no longer exists")

  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } })

  return issueTokenPair(user.id, user.role)
}

export const logoutUser = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken)
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

async function issueTokenPair(userId: string, role: Role) {
  const accessToken = signAccessToken({ id: userId, role })
  const refreshToken = signRefreshToken({ id: userId })

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  return { accessToken, refreshToken }
}
