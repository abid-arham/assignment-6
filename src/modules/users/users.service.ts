import { cloudinary, cloudinaryAgent } from "../../config/cloudinary.js";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { toSafeUser } from "../../utils/serialize.js";

export async function getMe(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  return toSafeUser(user);
}

export async function updateMe(userId: string, data: { name: string }) {
  const user = await prisma.user.update({ where: { id: userId }, data });
  return toSafeUser(user);
}

export async function updateAvatar(userId: string, file: Express.Multer.File) {
  if (!cloudinary) throw new AppError(500, "File storage is not configured");

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  // public_id = userId: a new upload replaces the old avatar instead of piling up files.
  const uploaded = await cloudinary.uploader
    .upload(dataUri, {
      folder: "ums/avatars",
      public_id: userId,
      overwrite: true,
      resource_type: "image",
      agent: cloudinaryAgent,
    })
    .catch((e: { error?: { message?: string } }) => {
      throw new AppError(502, `Image upload failed: ${e?.error?.message ?? "unknown error"}`);
    });

  const user = await prisma.user.update({ where: { id: userId }, data: { avatarUrl: uploaded.secure_url } });
  return toSafeUser(user);
}
