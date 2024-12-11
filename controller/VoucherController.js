import voucherModel from '../model/voucher.schema.js';

const voucherController = {
    createVoucher: async (req, res) => {
        try {
            const { code, discount, expiryDate, description, discountType } = req.body;
            
            const existingVoucher = await voucherModel.findOne({ code });
            if (existingVoucher) {
                return res.status(400).json({ message: 'Voucher code already exists' });
            }

            const newVoucher = new voucherModel({
                code,
                discount,
                expiryDate,
                description,
                discountType,
                createdBy: req.user.id 
            });

            await newVoucher.save();
            return res.status(201).json({ message: 'Voucher created successfully', voucher: newVoucher });

        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
};

export default voucherController;
