import userModel from "../model/user.schema.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv';
dotenv.config();

const getCloudinaryConfig = JSON.parse(process.env.CLOUD_DINARY_CONFIG);
cloudinary.config(getCloudinaryConfig);

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
            const user = await userModel.findOne({ email })
            const compare = bcrypt.compareSync(password, user.password);
            if (!compare) {
                throw new Error('Email or password is invalid!');
            }
            const token = jwt.sign({
                userId: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }, process.env.SECRETKEY, { expiresIn: 60 * 100 })
            res.status(200).send({
                message: "Login successful",
                accessToken: token,
            });
        } catch (error) {
            res.status(400).send({
                message: error.message
            })
        }

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
        let { email } = req.query;
        let user = await userModel.findOne({ email: email });
        if (user) {
            if (avatar) {
                const dataUrl = `data:${avatar.mimetype};base64,${avatar.buffer.toString('base64')}`;
                const uploaded = await cloudinary.uploader.upload(dataUrl,
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
        let user = req.body;
        let userId = req.user.userId;
        let rs = await userModel.findByIdAndUpdate(
            userId,
            user
        )
        res.status(200).send(rs)
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
}

export default userController;