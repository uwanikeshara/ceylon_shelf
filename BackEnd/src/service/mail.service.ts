import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config();

// Configure transporter (use your SMTP/email provider credentials)
const transporter = nodemailer.createTransport({
    secure: true, // true for 465, false for other ports
    host: 'smtp.gmail.com', 
    port: 465,
    auth: {
        user: process.env.Mail_USER,
        pass: process.env.Mail_PASS // your email password or app password
    }
});

// Send email function
async function sendMail(to: string, subject: string, text: string) {
    console.log("Preparing to send mail:", { to, subject, text });
    // If text is plain, wrap it in a simple HTML template
    const html = `
        <div style="font-family: Arial, sans-serif; font-size: 15px; color: #222;">
            ${text.replace(/\n/g, "<br>")}
        </div>
    `;
    return await transporter.sendMail({
        from: '"Book Club" <manuthkausilu20031018@gmail.com>',
        to: to,
        subject: subject,
        html: html
    });
}

export default {sendMail};