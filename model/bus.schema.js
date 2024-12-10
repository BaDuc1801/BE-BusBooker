import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
    img: [String],
    totalSeats: { type: Number, required: true }, // Tổng số ghế trên xe
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, // Trạng thái xe
    owner: String,
    licensePlate: String,
}, { timestamps: true });

const BusModel = mongoose.model('bus', BusSchema);

export default BusModel;
