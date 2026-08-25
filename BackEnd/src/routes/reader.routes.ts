import { Router } from "express";
import { 
     createReader,
     getReaders,
     getReaderById,
     updateReader,
     deleteReader,
     getReaderCount
 } from "../controllers/reader.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const readerRouter = Router();

readerRouter.post("/", authenticateToken, createReader);
readerRouter.get("/", authenticateToken, getReaders);
readerRouter.put("/:id", authenticateToken, updateReader);
readerRouter.delete("/:id", authenticateToken, deleteReader);
readerRouter.get("/count", authenticateToken, getReaderCount);
readerRouter.get("/:id", authenticateToken, getReaderById);

export default readerRouter;   