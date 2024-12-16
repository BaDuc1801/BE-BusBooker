import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    username: String,
    phoneNumber: String,
    email: String,
    garage: {
        type: String,
        default: ""
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const NotiModel = mongoose.model('notifications', NotificationSchema);

export default NotiModel;
