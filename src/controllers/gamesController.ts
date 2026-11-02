import { request, response } from "express"
import express, { type Express, type Request, type Response } from 'express'
import pool from "../db/index.ts"

export const getGames = async (req: Request, res: Response) => {
  const [games] = await pool.query("select * from games")

  res.status(200).json({
    message: "Games fetched!",
    data: games
  })
}

export const postGame = async (req: Request, res: Response) => {
  const { title, developer, rating } = req.body

  await pool.execute(
    "insert into games (title, developer, rating) values (?, ?, ?)",
    [title, developer, rating]
  )

  res.status(201).json({
    message: "Game ditambahkan!",
    data: req.body
  })
}

export const updateGame = async (req: Request, res: Response) => {
  const { title, developer, rating } = req.body
  const { id } = req.params

  await pool.execute(
    "update games set title = ?, developer = ?, rating = ? where id = ?",
    [title, developer, rating, id]
  )

  res.status(200).json({
    message: "Game berhasil diupdate!",
    data: req.body
  })
}

export const deleteGame = async (req: Request, res: Response) => {
  const { id } = req.params

  await pool.execute(
    "delete from games where id = ?",
    [id]
  )

  res.status(200).json({
    message: "Game berhasil dihapus!"
  })
}