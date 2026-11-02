import express, { type Express, type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import multer from 'multer'
import 'dotenv/config'
import { authMiddleware } from './middlewares/authMiddleware.ts'
import { adminMiddleware } from './middlewares/adminMiddleware.ts'
import { uploadPhoto } from './middlewares/uploadMiddleware.ts'
import { getGames, postGame, updateGame, deleteGame } from "./controllers/gamesController.ts"
import { getUsers, deleteUsers} from "./controllers/userController.ts"
import { login, register} from "./controllers/authController.ts"
import { getProfile, uploadProfilePhoto } from "./controllers/profileController.ts"

const app: Express  = express()
const port          = process.env.port || 3000

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`)
  next()
})

// CRUD
app.get("/api/games", authMiddleware, getGames)
app.post("/api/games", authMiddleware,adminMiddleware, postGame)
app.put("/api/games/:id", authMiddleware, adminMiddleware, updateGame)
app.delete("/api/games/:id", authMiddleware, adminMiddleware, deleteGame)

// buat register
app.post("/api/register", register)

//  buat login
app.post("/api/login", login)

// ini buat liat semua user, cuma admin
app.get("/api/users", authMiddleware, adminMiddleware, getUsers)

// ini buat hapus user, cuma admin yang bisa
app.delete("/api/users/:id", authMiddleware, adminMiddleware, deleteUsers)

// profile (foto profile)
app.get("/api/profile", authMiddleware, getProfile)
app.post("/api/profile/photo", authMiddleware, uploadPhoto, uploadProfilePhoto)

// handle error upload (file kebesaran / bukan gambar)
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Ukuran foto maksimal 2MB!"
      : error.message

    return res.status(400).json({ message })
  }

  if (error instanceof Error) {
    return res.status(400).json({
      message: error.message
    })
  }

  res.status(500).json({
    message: "Terjadi kesalahan server!"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})