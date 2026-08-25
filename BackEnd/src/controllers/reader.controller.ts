import { NextFunction, Request, Response } from "express";
import { ReaderModel } from "../models/Reader";
import { APIError } from "../errors/ApiError";
import { emitEvent } from "../socket";

export const createReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phoneNumber, address } = req.body;
        const newReader = new ReaderModel({ name, email, phoneNumber, address });
        await newReader.save();

        emitEvent("reader_updated", { action: "create", reader: newReader });

        res.status(201).json(newReader);
    } catch (error: any) {
        next(error);
    }
}

export const getReaders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const readers = await ReaderModel.find().sort({ _id: -1 });
        res.status(200).json(readers);
    } catch (error: any) {
        next(error);
    }
}

export const getReaderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reader = await ReaderModel.findById(req.params.id);
        if (!reader) {
            throw new APIError(404, "Reader not found");
        }
        res.status(200).json(reader);
    } catch (error: any) {
        next(error);
    }
}

export const updateReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedReader = await ReaderModel.findByIdAndUpdate(req.params.id, req.body, {
             new: true, 
             runValidators: true
            });
        if (!updatedReader) {
            throw new APIError(404, "Reader not found");
        }

        emitEvent("reader_updated", { action: "update", reader: updatedReader });

        res.status(200).json(updatedReader);
    } catch (error: any) {
        next(error);
    }
}

export const deleteReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedReader = await ReaderModel.findByIdAndDelete(req.params.id);
        if (!deletedReader) {
            throw new APIError(404, "Reader not found");
        }

        emitEvent("reader_updated", { action: "delete", id: req.params.id });

        res.status(200).send();
    } catch (error: any) {
        next(error);
    }
}

export const getReaderCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const count = await ReaderModel.countDocuments();
        res.status(200).json({ count });
    } catch (error: any) {
        next(error);
    }
}