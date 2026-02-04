import dotenv from "dotenv";
dotenv.config();

import express from "express";
import type { Request, Response } from "express";
import { prisma } from "db/client";
const app = express();

app.use(express.json());

app.post("/website", async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    res.status(411).json({
      message: "put url",
    });
    return;
  }
  const website = await prisma.website.create({
    data: {
      url,
      userId: req.user.id,
    },
  });
  res.json({
    id: website.id,
  });
});

app.get("/status/:websiteId", (req, res) => {});

import userRouter from "./routes/v1/user.routes";

app.use("/api/v1/user", userRouter);

app.listen(3000, () => console.log("server running at 3000"));
