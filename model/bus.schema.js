import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
    scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'schedules'}, // Liên kết đến tuyến xe
    img: [String],
    availableSeats: { type: Number, required: true }, // Số ghế còn lại
    totalSeats: { type: Number, required: true }, // Tổng số ghế trên xe
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, // Trạng thái xe
    seats: [{ // Mảng chứa thông tin về từng ghế
        seatNumber: { type: String, required: true }, // Số ghế (ví dụ: "1A", "2B", ...)
        isBooked: { type: Boolean, default: false }, // Trạng thái ghế (đặt hay chưa)
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // Người đã đặt ghế, nếu có
        location: { // Phân loại ghế theo khu vực
            type: String,
            enum: ['front', 'middle', 'back'], // Các khu vực ghế (trước, giữa, sau)
            required: true,
        },
        price: { // Giá vé cho từng khu vực ghế
            type: Number,
            required: true,
        }
    }],
    owner: String,
}, { timestamps: true });

const BusModel = mongoose.model('bus', BusSchema);

export default BusModel;
