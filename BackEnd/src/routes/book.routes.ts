import { Router } from "express";
import {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    getBookCountWithoutCopies,
    getBookCountWithCopies
} from "../controllers/book.controller";
import { authenticateToken } from './../middlewares/authenticateToken';

const router = Router();

router.post("/", authenticateToken, createBook);
router.get("/", authenticateToken, getBooks);
router.put("/:id", authenticateToken, updateBook);
router.delete("/:id", authenticateToken, deleteBook);
router.get("/count/without-copies", authenticateToken, getBookCountWithoutCopies);
router.get("/count/with-copies", authenticateToken, getBookCountWithCopies);
router.get("/:id", authenticateToken, getBookById);

export default router;
