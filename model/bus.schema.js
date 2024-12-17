import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
    img: [String],
    totalSeats: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    owner: String,
    licensePlate: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reviews',
    }],
}, { timestamps: true });

const BusModel = mongoose.model('bus', BusSchema);

export default BusModel;
