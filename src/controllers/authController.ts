import { request, response } from "express"
import express, { type Express, type Request, type Response } from 'express'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import pool from "../db/index.ts"

export const register = async (req: Request, res: Response) => {
   const { username, email, password, role } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Username, email, dan password wajib diisi!"
    })
  }

  const [users]: any = await pool.execute(
    "select * from users where email = ?",
    [email]
  )

  if (users.length > 0) {
    return res.status(400).json({
      message: "Email sudah terdaftar!"
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await pool.execute(
    "insert into users (username, email, password, role) values (?, ?, ?, ?)",
    [username, email, hashedPassword, role]
  )

  res.status(201).json({
    message: "Register berhasil!",
    data : {
      username: username,
      email: email,
      password: hashedPassword,
      role: role
    }
  })
}

export const login = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      message: "Email & Password wajib diisi!"
    })
  }

  const [users]: any = await pool.execute("select * from users where email = ?", [req.body.email])

  if (!users.length) {
    console.log(`[LOGIN FAILED] User not found: ${req.body.email}`)
    return res.status(400).json({
      message: "Login gagal! User tidak ditemukan!"
    })
  }

 const passwordMatch = await bcrypt.compare(
  req.body.password,
  users[0].password
)

console.log(`[LOGIN CHECK] ${req.body.email} -> password match: ${passwordMatch}`)

if (!passwordMatch) {
  return res.status(400).json({
    message: "Login gagal!"
  })
}

  const token = jwt.sign({
  id: users[0].id,
  username: users[0].username,
  email: users[0].email,
  role: users[0].role
}, process.env.JWT_SECRET || "super-secret", { expiresIn: "1h" })

  res.status(200).json({
    message : "Login berhasil!",
    token   : token
  })
}