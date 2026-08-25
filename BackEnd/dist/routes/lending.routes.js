"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lending_controller_1 = require("../controllers/lending.controller");
const authenticateToken_1 = require("./../middlewares/authenticateToken");
const router = (0, express_1.Router)();
// Lending CRUD
router.post("/", authenticateToken_1.authenticateToken, lending_controller_1.createLending);
router.patch("/complete/:id", authenticateToken_1.authenticateToken, lending_controller_1.completeLending);
router.get("/", authenticateToken_1.authenticateToken, lending_controller_1.getLendings);
router.put("/:id", authenticateToken_1.authenticateToken, lending_controller_1.updateLending);
router.delete("/:id", authenticateToken_1.authenticateToken, lending_controller_1.deleteLending);
router.get("/count", authenticateToken_1.authenticateToken, lending_controller_1.getLendingCount);
// Lending history
router.get("/history/book/:bookId", authenticateToken_1.authenticateToken, lending_controller_1.getLendingHistoryByBook);
router.get("/history/reader/:readerId", authenticateToken_1.authenticateToken, lending_controller_1.getLendingHistoryByReader);
// Overdue management
router.get("/overdue/lendings", authenticateToken_1.authenticateToken, lending_controller_1.getOverdueLendings);
router.get("/overdue/reader/:readerId", authenticateToken_1.authenticateToken, lending_controller_1.getOverdueBooksByReader);
router.post("/overdue/notify/:lendingId", authenticateToken_1.authenticateToken, lending_controller_1.sendOverdueNotification);
router.get("/overdue/count", authenticateToken_1.authenticateToken, lending_controller_1.getOverdueCount);
router.get("/:id", authenticateToken_1.authenticateToken, lending_controller_1.getLendingById);
exports.default = router;
