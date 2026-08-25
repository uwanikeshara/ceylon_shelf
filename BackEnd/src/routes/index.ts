import { Router } from "express";
import readerRouter  from "./reader.routes";
import authRouter from "./auth.routes";
import bookRouter from "./book.routes";
import lendingRouter from "./lending.routes";

const rootRouter = Router();

rootRouter.use("/reader", readerRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/book", bookRouter);
rootRouter.use("/lending", lendingRouter);

export default rootRouter;