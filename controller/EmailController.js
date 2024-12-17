import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from "bcrypt"
import userModel from '../model/user.schema.js';
dotenv.config();

const sendEmailService = async (email) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '<minhduc180104@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello!", // plain text body
        html: "<b>Mật khẩu mới: 123456@</b>", // html body
    });
    return info
}

const EmailController = {
    sendEmail : async (req, res) => {
        const {email} = req.body;
        const newPassword = "123456@"; 
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await userModel.updateOne({ email: email }, { password: hashedPassword });
        const rs = await sendEmailService(email);
        res.status(200).send(rs)
    }
}

export default EmailController;