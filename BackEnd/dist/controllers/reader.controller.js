"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReaderCount = exports.deleteReader = exports.updateReader = exports.getReaderById = exports.getReaders = exports.createReader = void 0;
const Reader_1 = require("../models/Reader");
const ApiError_1 = require("../errors/ApiError");
const socket_1 = require("../socket");
const createReader = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phoneNumber, address } = req.body;
        const newReader = new Reader_1.ReaderModel({ name, email, phoneNumber, address });
        yield newReader.save();
        (0, socket_1.emitEvent)("reader_updated", { action: "create", reader: newReader });
        res.status(201).json(newReader);
    }
    catch (error) {
        next(error);
    }
});
exports.createReader = createReader;
const getReaders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readers = yield Reader_1.ReaderModel.find().sort({ _id: -1 });
        res.status(200).json(readers);
    }
    catch (error) {
        next(error);
    }
});
exports.getReaders = getReaders;
const getReaderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reader = yield Reader_1.ReaderModel.findById(req.params.id);
        if (!reader) {
            throw new ApiError_1.APIError(404, "Reader not found");
        }
        res.status(200).json(reader);
    }
    catch (error) {
        next(error);
    }
});
exports.getReaderById = getReaderById;
const updateReader = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedReader = yield Reader_1.ReaderModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedReader) {
            throw new ApiError_1.APIError(404, "Reader not found");
        }
        (0, socket_1.emitEvent)("reader_updated", { action: "update", reader: updatedReader });
        res.status(200).json(updatedReader);
    }
    catch (error) {
        next(error);
    }
});
exports.updateReader = updateReader;
const deleteReader = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedReader = yield Reader_1.ReaderModel.findByIdAndDelete(req.params.id);
        if (!deletedReader) {
            throw new ApiError_1.APIError(404, "Reader not found");
        }
        (0, socket_1.emitEvent)("reader_updated", { action: "delete", id: req.params.id });
        res.status(200).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteReader = deleteReader;
const getReaderCount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield Reader_1.ReaderModel.countDocuments();
        res.status(200).json({ count });
    }
    catch (error) {
        next(error);
    }
});
exports.getReaderCount = getReaderCount;
