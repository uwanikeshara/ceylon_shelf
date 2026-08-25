import express from "express";
import http from "http";
import dotenv from "dotenv";
import { connectDB } from "./db/mongo";
import rootRouter from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import { initSocket } from "./socket";

dotenv.config();
const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.use("/api", rootRouter);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    server.listen(port, () => {
      console.log(`[CeylonShelf Backend] Server online at http://localhost:${port}`);
    });
  });
}

export { app, server };