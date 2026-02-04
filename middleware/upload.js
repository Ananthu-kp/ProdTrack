import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },

    filename: function (req, file, cb) {
        const unique = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())

    const mimeType = allowedTypes.test(file.mimeType)
    if (extname && mimeType) {
        cb(null, true)
    } else {
        cb(new Error('Only image files are allowed! (jpeg, jpg, png, gif, webp)'))
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 5 * 1024 * 1024
    },
    fileFilter: fileFilter
})

export default upload;