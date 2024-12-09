import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'bus', required: true }, // Xe liên kết với lịch trình
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'route', required: true }, // Liên kết với tuyến xe (Route)
    startTime: { type: Date, required: true }, // Thời gian bắt đầu
    endTime: { type: Date, required: true }, // Thời gian kết thúc
    status: { type: String, enum: ['available', 'full', 'completed'], default: 'available' }, // Trạng thái của lịch trình
}, { timestamps: true });

const ScheduleModel = mongoose.model('schedules', ScheduleSchema);

export default ScheduleModel;
