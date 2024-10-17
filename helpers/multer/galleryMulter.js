import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB file size limit
      }, 
}).single('image')


export default upload