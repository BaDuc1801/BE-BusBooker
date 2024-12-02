import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
    licensePlate: { type: String, required: true, unique: true }, // Biển số xe
    operator: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    route: {
        start:  String, 
        end:  String, 
    },
    departureTime: Date, // Thời gian khởi hành
    arrivalTime: Date,   // Thời gian dự kiến đến nơi
    seats: [
        {
            seatNumber: String,
            isAvailable: { type: Boolean, default: true },
            price: Number
        }
    ],
    status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' }, 
}, { timestamps: true });

const busModel = mongoose.model('bus', BusSchema);

export default busModel;