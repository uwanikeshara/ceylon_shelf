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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure transporter (use your SMTP/email provider credentials)
const transporter = nodemailer_1.default.createTransport({
    secure: true, // true for 465, false for other ports
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.Mail_USER,
        pass: process.env.Mail_PASS // your email password or app password
    }
});
// Send email function
function sendMail(to, subject, text) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Preparing to send mail:", { to, subject, text });
        // If text is plain, wrap it in a simple HTML template
        const html = `
        <div style="font-family: Arial, sans-serif; font-size: 15px; color: #222;">
            ${text.replace(/\n/g, "<br>")}
        </div>
    `;
        return yield transporter.sendMail({
            from: '"Book Club" <manuthkausilu20031018@gmail.com>',
            to: to,
            subject: subject,
            html: html
        });
    });
}
exports.default = { sendMail };
