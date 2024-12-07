import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // Người nhận thông báo
    message: { type: String, required: true }, // Nội dung thông báo
    status: { type: String, enum: ['read', 'unread'], default: 'unread' }, // Trạng thái thông báo
}, { timestamps: true });

const Notification = mongoose.model('notifications', NotificationSchema);

export default Notification;
