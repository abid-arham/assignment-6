import multer from "multer";
import { AppError } from "../utils/AppError.js";

// Memory storage: serverless functions have no persistent disk, and 2 MB stays
// well under Vercel's 4.5 MB request body limit.
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new AppError(422, "Only image files are allowed"));
  },
});
