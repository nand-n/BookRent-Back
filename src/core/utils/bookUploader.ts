
import { diskStorage } from "multer";
import { extname } from "path";

export const multerOptionsForBooks = {
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
  storage: diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join("");
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};
