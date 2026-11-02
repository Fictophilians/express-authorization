import type { Request, Response } from "express"
import pool from "../db/index.ts"
import cloudinary from "../lib/cloudinary.ts"

type AuthRequest = Request & {
  user?: { id: number; username?: string; email?: string; role?: string }
}

// upload buffer ke cloudinary, balikin secure_url
const uploadToCloudinary = (buffer: Buffer) => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "profile" }, (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Upload ke cloudinary gagal"))
        }

        resolve(result)
      })
      .end(buffer)
  })
}

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id

  if (!userId) {
    return res.status(401).json({
      message: "Token invalid!"
    })
  }

  const [users]: any = await pool.execute(
    "select id, username, email, role, profile_photo from users where id = ?",
    [userId]
  )

  if (!users.length) {
    return res.status(404).json({
      message: "User tidak ditemukan!"
    })
  }

  res.status(200).json({
    message: "Welcome!",
    data: users[0]
  })
}

export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id

    if (!userId) {
      return res.status(401).json({
        message: "Token invalid!"
      })
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Foto belum dipilih!"
      })
    }

    const result = await uploadToCloudinary(req.file.buffer)

    await pool.execute(
      "update users set profile_photo = ? where id = ?",
      [result.secure_url, userId]
    )

    res.status(200).json({
      message: "Foto profile berhasil diupload!",
      photo: result.secure_url
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Gagal upload foto!",
      error: error.message
    })
  }
}
