import mongoose from "mongoose";

type Reader = {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    registerDate: Date;
}

const readerSchema = new mongoose.Schema<Reader>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    registerDate: { type: Date, default: Date.now },
});

export const ReaderModel = mongoose.model("Reader", readerSchema);
