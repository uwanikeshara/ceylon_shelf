"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reader_routes_1 = __importDefault(require("./reader.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const book_routes_1 = __importDefault(require("./book.routes"));
const lending_routes_1 = __importDefault(require("./lending.routes"));
const rootRouter = (0, express_1.Router)();
rootRouter.use("/reader", reader_routes_1.default);
rootRouter.use("/auth", auth_routes_1.default);
rootRouter.use("/book", book_routes_1.default);
rootRouter.use("/lending", lending_routes_1.default);
exports.default = rootRouter;
