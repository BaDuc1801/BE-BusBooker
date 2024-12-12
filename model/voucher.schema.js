import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    name: String,
    discount: {
        type: Number,
    },
    discountType: {
        type: String,
        enum: ['percent', 'fixed'],
    },
    expiryDate: Date,
    description: String,
    count: Number,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true
})

const voucherModel = mongoose.model('vouchers', voucherSchema);

export default voucherModel;
