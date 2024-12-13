import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'bus', required: true }, // Xe liên kết với lịch trình
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'routes', required: true }, // Liên kết với tuyến xe (Route)
    startTime: { type: Date, required: true }, // Thời gian bắt đầu
    endTime: { type: Date, required: true }, // Thời gian kết thúc
    availableSeats: { type: Number, required: true }, // Số ghế còn lại
    seats: [{
        seatNumber: { type: String, required: true }, // Số ghế
        isBooked: { type: Boolean, default: false }, // Trạng thái ghế
        location: { // Phân loại ghế theo khu vực
            type: String,
            enum: ['front', 'middle', 'back'], // Các khu vực ghế (trước, giữa, sau)
            required: true,
        },
        price: { type: Number, required: true }, // Giá vé
    }],
    status: { type: String, enum: ['available', 'full', 'completed'], default: 'available' }, // Trạng thái của lịch trình
}, { timestamps: true });

const ScheduleModel = mongoose.model('schedules', ScheduleSchema);

export default ScheduleModel;
