"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitEvent = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io = null;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
        },
    });
    io.on("connection", (socket) => {
        console.log(`[WebSocket] Client connected: ${socket.id}`);
        socket.on("disconnect", () => {
            console.log(`[WebSocket] Client disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const emitEvent = (event, payload) => {
    if (io) {
        io.emit(event, payload);
    }
};
exports.emitEvent = emitEvent;
