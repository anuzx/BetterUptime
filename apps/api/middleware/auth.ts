import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserJwtPayload {
  id: number;
  email: string;
}

export function authMiddleware(req:Request, res:Response, next:NextFunction) {
  const token = req.headers.authorization!;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
try {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserJwtPayload;
  
    req.user = decoded; // { id: number, ... }
    next();
} catch (error) {
  console.log(error);
  
}
}
