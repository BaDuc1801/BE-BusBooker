import BusModel from "../model/bus.schema.js";
import ReviewModel from "../model/review.schema.js";
import ScheduleModel from "../model/schedule.schema.js";
import TicketModel from "../model/ticket.schema.js";

const TicketController = {
    postTicket: async (req, res) => {
        const {
            userId,
            paymentMethod,
            scheduleId,
            seatNumbers,
            price,
            voucher,
            phoneNumber,
            status,
            email,
            username,
        } = req.body;
        let rs = await TicketModel.create({ email, username, phoneNumber, paymentMethod, scheduleId, seatNumbers, price, userId, voucher, status });
        res.status(200).send(rs)
    },

    updateTicket: async (req, res) => {
        let { status, ticketId } = req.body;
        let rs = await TicketModel.findByIdAndUpdate({ _id: ticketId }, { status: status }, { new: true });
        res.status(200).send(rs)
    },

    getAllTicket: async (req, res) => {
        let rs = await TicketModel.find().populate('userId').populate('scheduleId').populate({
            path: 'scheduleId',
            populate: {
                path: 'busId'
            }
        }).populate({
            path: 'scheduleId',
            populate: {
                path: 'routeId'
            }
        }).sort({ createdAt: -1 });
        res.status(200).send(rs)
    },

    getTicketById: async (req, res) => {
        try {
            let userId = req.params.id;

            if (!userId) {
                return res.status(400).send({ message: "userId is required" });
            }

            const currentTime = new Date();

            const tickets = await TicketModel.find({ userId: userId })
                .populate('scheduleId')


            for (const ticket of tickets) {
                const departureStartTime = ticket.scheduleId.startTime; // Lấy startTime từ scheduleId

                if (departureStartTime < currentTime && ticket.status !== 'completed') {
                    ticket.status = 'completed';
                    await ticket.save();
                }
            }

            let ticket = await TicketModel.find({ userId: userId }).populate('scheduleId').populate({
                path: 'scheduleId',
                populate: {
                    path: 'busId'
                }
            }).populate({
                path: 'scheduleId',
                populate: {
                    path: 'routeId'
                }
            }).sort({ createdAt: -1 });

            if (!ticket) {
                return res.status(404).send({ message: "Ticket not found" });
            }

            res.status(200).send(ticket);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal server error" });
        }
    },
    cancelTicket: async (req, res) => {
        try {
            const { ticketId } = req.body;

            let ticket = await TicketModel.findById(ticketId).populate('scheduleId');

            if (!ticket) {
                return res.status(404).send({ message: "Ticket not found" });
            }

            ticket.status = 'cancelled';

            if (ticket.scheduleId) {
                // Trả lại ghế cho chuyến đi khởi hành
                for (let seat of ticket.seatNumbers) {
                    // Cập nhật trạng thái ghế đã đặt thành chưa đặt
                    await ScheduleModel.updateOne(
                        {
                            _id: ticket.scheduleId._id,
                            'seats.seatNumber': seat
                        },
                        {
                            $set: {
                                'seats.$.isBooked': false, // Đặt lại trạng thái ghế
                            },
                            $inc: { 'availableSeats': 1 } // Tăng số ghế còn lại
                        }
                    );
                }
            }


            await ticket.save();

            res.status(200).send({ message: "Ticket cancelled successfully", ticket });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error cancelling the ticket" });
        }
    },

    addReview: async (req, res) => {
        const { userId, content, rating, busId, ticketId } = req.body;

        try {
            const newReview = new ReviewModel({
                userId,
                content,
                rating,
            });

            await newReview.save();

            const updated = await BusModel.findByIdAndUpdate(
                { _id: busId },
                {
                    $push: { reviews: newReview._id },
                },
                { new: true }
            );

            await TicketModel.findByIdAndUpdate(
                ticketId,
                {
                    hasReviewed: true
                },
                { new: true }
            )
            if (!updated) {
                return res.status(404).send({ message: 'Bus không tồn tại' });
            }

            res.status(200).send(updated);
        } catch (error) {
            res.status(500).send({ message: 'Lỗi khi thêm review', error: error.message });
        }
    }

}

export default TicketController;