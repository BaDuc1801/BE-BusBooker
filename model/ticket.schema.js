import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'bus', required: true }, // Xe liên kết với vé
    seatNumber: { type: String, required: true }, // Số ghế đã đặt
    price: { type: Number, required: true }, // Giá vé
    purchasedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
    status: {
        type: String, 
        enum: ['booked', 'cancelled', 'completed'],
        default: 'booked',
    },
    isCancelled: { type: Boolean, default: false },
}, { timestamps: true });

const Ticket = mongoose.model('ticket', TicketSchema);

export default Ticket;
