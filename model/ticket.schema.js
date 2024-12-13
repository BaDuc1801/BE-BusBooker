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
    departureTrip: {
        scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'schedules', required: true },
        seatNumbers: [{ type: String, required: true }]
    },

    returnTrip: {
        scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'schedules' },
        seatNumbers: [{ type: String }],
    },
    price: { type: Number, required: true },
    phoneNumber: String,
    email: String,
    username: String,
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'vouchers' }
}, { timestamps: true });

const TicketModel = mongoose.model('ticket', TicketSchema);

export default TicketModel;
