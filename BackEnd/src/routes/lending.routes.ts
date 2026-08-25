import { Router } from "express";
import {
    createLending,
    completeLending,
    getLendings,
    getLendingById,
    updateLending,
    deleteLending,
    getLendingHistoryByBook,
    getLendingHistoryByReader,
    getOverdueBooksByReader,
    sendOverdueNotification,
    getOverdueLendings,
    getOverdueCount,
    getLendingCount
} from "../controllers/lending.controller";
import { authenticateToken } from './../middlewares/authenticateToken';

const router = Router();

// Lending CRUD
router.post("/", authenticateToken, createLending);
router.patch("/complete/:id", authenticateToken, completeLending);
router.get("/", authenticateToken, getLendings);
router.put("/:id", authenticateToken, updateLending);
router.delete("/:id", authenticateToken, deleteLending);
router.get("/count", authenticateToken, getLendingCount);

// Lending history
router.get("/history/book/:bookId", authenticateToken, getLendingHistoryByBook);
router.get("/history/reader/:readerId", authenticateToken, getLendingHistoryByReader);

// Overdue management
router.get("/overdue/lendings", authenticateToken, getOverdueLendings);
router.get("/overdue/reader/:readerId", authenticateToken, getOverdueBooksByReader);
router.post("/overdue/notify/:lendingId", authenticateToken, sendOverdueNotification);
router.get("/overdue/count", authenticateToken, getOverdueCount);

router.get("/:id", authenticateToken, getLendingById);

export default router;
