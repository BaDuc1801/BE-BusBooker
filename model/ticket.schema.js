import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'bus', required: true }, // Xe bus liên quan
    seatNumber: String, // Số ghế
    price: Number,
    purchasedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }, // Người mua vé (Customer)
    isCancelled: {
        type: Boolean,
        default: false
    }, // Trạng thái hủy vé
}, {
    timestamps: true
});

const ticketModel = mongoose.model('tickets', TicketSchema);

export default ticketModel