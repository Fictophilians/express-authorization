import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024 // maksimal 2MB
  },
  fileFilter: (req, file, cb) => {
    const isImageMime = file.mimetype.startsWith("image/")
    const isImageExt = /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(file.originalname)

    if (!isImageMime && !isImageExt) {
      return cb(new Error("File harus berupa gambar!"))
    }

    cb(null, true)
  }
})

export const uploadPhoto = upload.single("photo")
