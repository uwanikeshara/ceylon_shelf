"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIError = void 0;
class APIError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.APIError = APIError;
