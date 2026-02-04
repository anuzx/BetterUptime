
import type { Request, Response } from "express";
import { SigninSchema, SignupSchema } from "../schema/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "db/client";
import { JWT_SECRET } from "../constants";


export const handleSignup = async (req: Request, res: Response) => {
  const parsedData = SignupSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "incoorect inputs",
    });
    return;
  }
  const hashedPassword = await bcrypt.hash(parsedData.data?.password, 10);

  try {
    await prisma.user.create({
      data: {
        username: parsedData.data?.username,
        password: hashedPassword,
        email: parsedData.data?.email,
      },
    });

    res.status(201).json({
      message: "user registered successfully",
    });
  } catch (e) {
    res.status(411).json({
      message: "user already exist",
    });
  }
};

export const handleSignin = async (req: Request, res: Response) => {
  const parsedData = SigninSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "incoorect input",
    });
    return;
  }
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });
    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid username",
      });
    }
    const validpassword = bcrypt.compare(
      parsedData.data.password,
      existingUser.password,
    );

    if (!validpassword) {
      res.status(401).json({
        message: "invalid password",
      });
    }
    const token = jwt.sign(
      {
        id: existingUser.id,
      },
      JWT_SECRET,
    );
      return res.status(200).json({
          message: "Login successful",
          token,
      })
  } catch (error) {
          res.status(411).json({
            message: "No such User",
          });

  }
};
