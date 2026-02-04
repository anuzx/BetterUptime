import "dotenv/config";

import express from "express";

const app = express();

app.use(express.json());

import userRouter from "./routes/v1/user.routes";
import webRouter from "./routes/v1/website.routes";

app.use("/api/v1/user", userRouter);

app.use("/api/v1/website", webRouter);


app.listen(3001, () => console.log("server running at 3001"));
