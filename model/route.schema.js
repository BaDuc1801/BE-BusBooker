import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
    img: String,
    origin: { type: String, required: true }, // Điểm xuất phát
    destination: { type: String, required: true }, // Điểm đến
    basisPrice: { type: Number, required: true }, // Giá vé cho tuyến xe
    afterDiscount: Number, 
    schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'schedules', default: '[]' }], // Liên kết với các lịch trình
}, { timestamps: true });

const RouteModel = mongoose.model('routes', RouteSchema);

export default RouteModel;
