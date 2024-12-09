import BusModel from '../model/bus.schema.js';
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv';
dotenv.config();

const getCloudinaryConfig = JSON.parse(process.env.CLOUD_DINARY_CONFIG);
cloudinary.config(getCloudinaryConfig);

const BusController = {
    addBus11: async (req, res) => {
        const { owner, price } = req.body;

        const frontPrice = price.front;
        const middlePrice = price.middle;
        const backPrice = price.back;

        const seats = [
            ...Array.from({ length: 2 }, (_, i) => ({ seatNumber: `S${i + 1}`, location: 'front', price: frontPrice })),
            ...Array.from({ length: 6 }, (_, i) => ({ seatNumber: `S${i + 3}`, location: 'middle', price: middlePrice })),
            ...Array.from({ length: 3 }, (_, i) => ({ seatNumber: `S${i + 9}`, location: 'back', price: backPrice })),
        ];

        const newBus = await BusModel.create({
            availableSeats: 11,
            totalSeats: 11,
            seats,
            owner
        });

        try {
            const savedBus = await newBus.save();
            res.status(201).json(savedBus);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    addBus9: async (req, res) => {
        const { owner, price } = req.body;

        const frontPrice = price.front;
        const middlePrice = price.middle;
        const backPrice = price.back;

        const seats = [
            ...Array.from({ length: 2 }, (_, i) => ({ seatNumber: `S${i + 1}`, location: 'front', price: frontPrice })),
            ...Array.from({ length: 4 }, (_, i) => ({ seatNumber: `S${i + 3}`, location: 'middle', price: middlePrice })),
            ...Array.from({ length: 3 }, (_, i) => ({ seatNumber: `S${i + 7}`, location: 'back', price: backPrice })),
        ];

        const newBus = await BusModel.create({
            availableSeats: 9,
            totalSeats: 9,
            seats,
            owner
        });

        try {
            const savedBus = await newBus.save();
            res.status(201).json(savedBus);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    uploadImgItem: async (req, res) => {
        let imgs = req.files;
        let busId = req.params.id;
        let item = await BusModel.findOne({ _id: busId });

        if (item) {
            if (imgs && imgs.length > 0) {
                try {
                    const listResult = [];
                    for (let file of imgs) {
                        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                        const fileName = file.originalname.split('.')[0];

                        const result = await cloudinary.uploader.upload(dataUrl, {
                            public_id: fileName,
                            resource_type: 'auto',
                        });

                        listResult.push(result.url);
                    }

                    let rss = await BusModel.findByIdAndUpdate({ _id: busId }, { img: listResult });
                    return res.json({ message: 'Tệp được tải lên thành công.', rss });
                } catch (err) {
                    return res.status(500).json({ error: 'Lỗi khi upload hình ảnh.', err });
                }
            } else {
                return res.status(400).json({
                    message: 'Không có tệp được tải lên.'
                });
            }
        } else {
            return res.status(404).json({
                message: 'Item không tồn tại.'
            });
        }
    },

    updateBus: async (req, res) => {
        const busId = req.params.id;
        const updateData = req.body;
        const updatedBus = await BusModel.findByIdAndUpdate(busId, updateData, { new: true });
        res.status(200).send(updatedBus);
    },
}

export default BusController;

