import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'booked', 'cancelled', 'completed'],
        default: 'waiting',
    },
    paymentMethod: String,
    scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'schedules', required: true },
    seatNumbers: [{ type: String, required: true }],
    price: { type: Number, required: true },
    phoneNumber: String,
    email: String,
    username: String,
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'vouchers' },
    hasReviewed: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const TicketModel = mongoose.model('ticket', TicketSchema);

export default TicketModel;
