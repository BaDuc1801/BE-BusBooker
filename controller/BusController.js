import BusModel from '../model/bus.schema.js';
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv';
dotenv.config();

const getCloudinaryConfig = JSON.parse(process.env.CLOUD_DINARY_CONFIG);
cloudinary.config(getCloudinaryConfig);

const BusController = {
    createBus: async (req, res) => {
        let { totalSeats, owner, licensePlate } = req.body;
        let bus = await BusModel.create({ totalSeats, owner, licensePlate });
        res.status(200).send(bus)
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
        const updatedBus = await BusModel.findByIdAndUpdate({ _id: busId }, updateData, { new: true });
        res.status(200).send(updatedBus);
    },

    getBus: async (req, res) => {
        const all = await BusModel.find();
        res.status(200).send(all)
    },

    delbus: async (req, res) => {
        let busId = req.params.id;
        let rs = await BusModel.findByIdAndDelete(
            { _id: busId }
        )
        res.status(200).send(rs)
    },
    getBusReviews: async (req, res) => {
        const busId = req.params.id;

        try {
            const bus = await BusModel.findById(busId)
                .populate({
                    path: 'reviews', 
                    populate: {
                        path: 'userId', 
                    }
                });

            if (!bus) {
                return res.status(404).json({
                    message: 'Bus không tồn tại.'
                });
            }
            res.status(200).json({ reviews: bus.reviews });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Lỗi khi lấy reviews của bus.' });
        }
    },
}

export default BusController;

