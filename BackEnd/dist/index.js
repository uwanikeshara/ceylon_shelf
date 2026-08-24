"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongo_1 = require("./db/mongo");
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./middlewares/errorHandler");
const socket_1 = require("./socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
(0, socket_1.initSocket)(server);
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const port = process.env.PORT || 3000;
app.use("/api", routes_1.default);
app.use(errorHandler_1.errorHandler);
if (process.env.NODE_ENV !== "test") {
    (0, mongo_1.connectDB)().then(() => {
        server.listen(port, () => {
            console.log(`[CeylonShelf Backend] Server online at http://localhost:${port}`);
        });
    });
}
