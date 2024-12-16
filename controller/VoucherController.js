import voucherModel from '../model/voucher.schema.js';

const voucherController = {
    createVoucher: async (req, res) => {
        try {
            const { code, discount, expiryDate, description, discountType, name,  count} = req.body;
            
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
                name,
                count,
                createdBy: req.user.userId 
            });

            await newVoucher.save();
            return res.status(201).json({ message: 'Voucher created successfully', voucher: newVoucher });

        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },

    getVouchers: async (req, res) => {
        let all = await voucherModel.find().populate('createdBy');
        res.status(200).send(all)
    },

    updateVoucher: async (req, res) => {
        let voucher = req.body;
        let voucherId = req.params.id;
        let rs = await voucherModel.findByIdAndUpdate(
            {_id: voucherId},
            voucher,
            {new: true}
        )
        res.status(200).send(rs)
    },

    delVoucher: async (req, res) => {
        let voucherId = req.params.id;
        let rs = await voucherModel.findByIdAndDelete(
            {_id: voucherId}
        )
        res.status(200).send(rs) 
    }
};

export default voucherController;
