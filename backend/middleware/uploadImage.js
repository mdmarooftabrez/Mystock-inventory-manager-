import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (request, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      return callback(null, true);
    }

    return callback(new Error("Only image files are allowed"));
  },
});

export default upload;
