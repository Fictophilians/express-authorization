import { request, response } from "express"
import express, { type Express, type Request, type Response } from 'express'
import pool from "../db/index.ts"

export const getUsers = async (req: Request, res: Response) => {
  const [users] = await pool.query("select * from users")

  res.status(200).json({
    message: "Users fetched!",
    data: users
  })
}

export const deleteUsers = async (req: Request, res: Response) => {
  const { id } = req.params

  await pool.execute(
    "delete from users where id = ?",
    [id]
  )

  res.status(200).json({
    message: "User deleted!"
  })
}