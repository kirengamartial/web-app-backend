import multer from "multer";
import path from "path";

// Allowed file types
const allowedFileTypes = /jpeg|jpg|png|gif|mp4|avi|mov|mkv/;

// Storage configuration
const storage = multer.diskStorage({
   filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and videos are allowed."), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 100, // Limit file size to 10 MB
  },
  fileFilter,
}).single("upload"); // Expect the field name to be "image"

export default upload;
