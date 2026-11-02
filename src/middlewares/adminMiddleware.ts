import type { NextFunction, Request, Response } from "express";
import 'dotenv/config'

export function adminMiddleware (req: any, res: Response, next: NextFunction){
if (req.user?.role != "admin") {
    return res.status(401).json({
        message: "Khusus admin bro!"
    })
}
next()
}