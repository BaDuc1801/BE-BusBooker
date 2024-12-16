import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    phoneNumber: String,
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dzpw9bihb/image/upload/v1726676632/wgbdsrflw8b1vdalkqht.jpg"
    },
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['Customer', 'Admin', 'Operator'],
        default: 'Customer'
    },
    owner: String,
}, {
    timestamps: true
})

const userModel = mongoose.model('users', userSchema);

export default userModel