import userModel from "../model/user.schema.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const getCloudinaryConfig = JSON.parse(process.env.CLOUD_DINARY_CONFIG);
cloudinary.config(getCloudinaryConfig);

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
        from: '<minhduc180104@gmail.com>',
        to: email,
        subject: "Hello ✔",
        text: "Hello!",
        html: "<b>Mật khẩu mới: 123456@</b>",
    });
    return info
}

const userController = {
    getUsers: async (req, res) => {
        const listUser = await userModel.find();
        res.status(200).send(listUser)
    },

    register: async (req, res) => {
        try {
            const { email, password, username } = req.body;
            const hashedPassword = bcrypt.hashSync(password, 10);
            const saveuser = await userModel.create({
                username,
                email,
                password: hashedPassword,
            })
            res.status(201).send(saveuser)
        } catch (error) {
            res.status(400).send({
                message: error.message
            })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email });
            const compare = bcrypt.compareSync(password, user.password);
            if (!compare) {
                throw new Error('Email hoặc password không đúng');
            }
            const accessToken = jwt.sign({
                userId: user._id,
                role: user.role
            }, process.env.SECRETKEY, { expiresIn: "60m" });

            const refreshToken = jwt.sign({
                userId: user._id,
                role: user.role
            }, process.env.SECRETKEY, { expiresIn: "24h" });

            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
            });

            res.status(200).send({
                message: "Đăng nhập thành công",
                accessToken: accessToken
            })
        } catch (error) {
            res.status(400).send(error.message)
        }
    },

    refreshAccessToken: async (req, res) => {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Không tìm thấy refresh token' });
        }
        try {
            const decoded = jwt.verify(refreshToken, process.env.SECRETKEY);
            const user = await userModel.findById(decoded.userId);
            if (!user) {
                return res.status(403).json({ message: 'Không tìm thấy người dùng' });
            }

            const newAccessToken = jwt.sign({
                userId: user._id,
                role: user.role
            }, process.env.SECRETKEY, { expiresIn: "60m" });

            res.status(200).send({ accessToken: newAccessToken });
        } catch (error) {
            res.status(403).send({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
        }
    },

    logout: async (req, res) => {
        res.clearCookie('refresh_token');
        res.status(200).json({ message: "Đăng xuất thành công" })
    },

    resetPass: async (req, res) => {
        try {
            const { email, password } = req.body;
            const hashedPassword = bcrypt.hashSync(password, 10);
            const saveuser = await userModel.findOneAndUpdate({ email: email }, {
                password: hashedPassword
            })
            res.status(201).send(saveuser)
        } catch (error) {
            res.status(400).send({
                message: error.message
            })
        }
    },

    forgotPass: async (req, res) => {
        try {
            const { email } = req.body;
            const existEmail = await userModel.findOne({ email })
            if (!existEmail) {
                throw new Error('Email does not exist!')
            }
            const newOTP = Math.floor(100000 + Math.random() * 900000);
            const newCachOtp = {
                [newOTP]: email,
            }
            res.status(200).send({
                message: "OTP sent successfully!",
                data: newCachOtp
            })
        } catch (error) {
            res.status(200).send({
                message: error.message
            })
        }
    },

    uploadAvatar: async (req, res) => {
        let avatar = req.file;
        let userId = req.user.userId;
        let user = await userModel.findById(userId);
        if (user) {
            if (avatar) {
                const dataUrl = `data:${avatar.mimetype};base64,${avatar.buffer.toString('base64')}`;
                await cloudinary.uploader.upload(dataUrl,
                    { resource_type: 'auto' },
                    async (err, result) => {
                        if (result && result.url) {
                            user.avatar = result.url;
                            await user.save()
                            return res.status(200).json({
                                message: 'Client information updated successfully',
                                user: result.url
                            });
                        } else {
                            return res.status(500).json({
                                message: 'Error when upload file: ' + err.message
                            });
                        }
                    }
                )
            } else {
                return res.status(404).json({
                    message: 'Image not found'
                });
            }
        } else {
            return res.status(404).json({
                message: 'Client not found'
            });
        }
    },

    updateUser: async (req, res) => {
        let userId = req.user.userId;
        const userUpdates = req.body
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            userUpdates,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).send({ message: "Người dùng không tìm thấy" });
        }
        res.status(200).send(updatedUser);
    },

    updateUserById: async (req, res) => {
        let user = req.body;
        let userId = req.params.id;
        let rs = await userModel.findByIdAndUpdate(
            { _id: userId },
            user,
            { new: true }
        )
        res.status(200).send(rs)
    },

    changePassword: async (req, res) => {
        try {
            let userId = req.user.userId;
            let { oldP, newP } = req.body;

            const user = await userModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const isMatch = bcrypt.compareSync(oldP, user.password);
            if (!isMatch) {
                throw new Error('Old password is incorrect');
            }

            const hashedNewPassword = bcrypt.hashSync(newP, 10);
            const newUserP = await userModel.findByIdAndUpdate(userId, {
                password: hashedNewPassword
            })

            res.status(200).send({
                message: 'Password updated successfully',
                newUserP
            });
        } catch (error) {
            res.status(400).send({
                message: error.message,
            });
        }
    },

    getUserById: async (req, res) => {
        const userId = req.user.userId;
        const user = await userModel.findById(userId);
        res.status(200).send(user)
    },

    delUser: async (req, res) => {
        let user = req.body;
        let userId = req.params.id;
        let rs = await userModel.findByIdAndDelete(
            { _id: userId },
            user,
            { new: true }
        )
        res.status(200).send(rs)
    },

    updateUserByEmail: async (req, res) => {
        const { email } = req.body;
        const userUpdates = req.body;
        const updatedUser = await userModel.findOneAndUpdate(
            { email: email },
            {
                ...userUpdates,
                role: "Operator"
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "Người dùng không tìm thấy" });
        }
        res.status(200).send(updatedUser);
    },

    sendEmail: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });

            const newPassword = "123456@";
            const hashedPassword = bcrypt.hashSync(newPassword, 10);
            await userModel.updateOne({ email }, { password: hashedPassword });

            const rs = await sendEmailService(email);
            res.status(200).send(rs);
        } catch (error) {
            console.error("SEND EMAIL ERROR:", error);
            res.status(500).json({ message: "Lỗi server", error });
        }
    }
}

export default userController;