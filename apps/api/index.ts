import "dotenv/config";

import express from "express";
import type { Request, Response } from "express";
import { prisma } from "db/client";
import { authMiddleware } from "./middleware/auth";

//console.log(process.env.JWT_SECRET)

const app = express();

app.use(express.json());
import userRouter from "./routes/v1/user.routes";


app.use("/api/v1/user", userRouter);

app.post("/website",authMiddleware,  async (req: Request, res: Response) => {
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
      userId: req.user!.id,
    },
  });
  res.json({
    id: website.id,
  });
});

app.get("/status/:websiteId", (req, res) => {});




app.listen(3001, () => console.log("server running at 3001"));
