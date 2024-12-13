import ScheduleModel from "../model/schedule.schema.js";
import TicketModel from "../model/ticket.schema.js";

const TicketController = {
    postTicket: async (req, res) => {
        const {
            userId,
            paymentMethod,
            departureTrip,
            returnTrip,
            price,
            voucher,
            phoneNumber,
            status,
            email,
            username,
        } = req.body;
        let rs = await TicketModel.create({email, username, phoneNumber, paymentMethod, departureTrip, returnTrip, price, userId, voucher, status });
        res.status(200).send(rs)
    },

    updateTicket: async (req, res) => {
        let { status, ticketId } = req.body;
        let rs = await TicketModel.findByIdAndUpdate({ _id: ticketId }, { status: status }, { new: true });
        res.status(200).send(rs)
    },

    getAllTicket: async (req, res) => {
        let rs = await TicketModel.find().populate('userId').sort({createdAt: -1});
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
                .populate('departureTrip.scheduleId')
                .populate('returnTrip.scheduleId');

            for (const ticket of tickets) {
                const departureStartTime = ticket.departureTrip.scheduleId.startTime; // Lấy startTime từ scheduleId
                const returnEndTime = ticket.returnTrip.scheduleId ? ticket.returnTrip.scheduleId.endTime : null; // Lấy endTime từ returnTrip nếu có

                if (departureStartTime < currentTime && ticket.status !== 'completed') {
                    ticket.status = 'completed';
                    await ticket.save();
                } else if (returnEndTime && returnEndTime < currentTime && ticket.status !== 'completed') {
                    ticket.status = 'completed';
                    await ticket.save();
                }
            }

            let ticket = await TicketModel.find({ userId: userId }).populate('departureTrip.scheduleId').populate({
                path: 'departureTrip.scheduleId',
                populate: {
                    path: 'busId'
                }
            })
                .populate('returnTrip.scheduleId').populate({
                    path: 'returnTrip.scheduleId',
                    populate: {
                        path: 'busId'
                    }
                }).populate({
                    path: 'departureTrip.scheduleId',
                    populate: {
                        path: 'routeId'
                    }
                }).populate({
                    path: 'returnTrip.scheduleId',
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

            let ticket = await TicketModel.findById(ticketId).populate('departureTrip.scheduleId').populate('returnTrip.scheduleId');

            if (!ticket) {
                return res.status(404).send({ message: "Ticket not found" });
            }

            ticket.status = 'cancelled';

            if (ticket.departureTrip.scheduleId) {
                // Trả lại ghế cho chuyến đi khởi hành
                for (let seat of ticket.departureTrip.seatNumbers) {
                    // Cập nhật trạng thái ghế đã đặt thành chưa đặt
                    await ScheduleModel.updateOne(
                        { 
                            _id: ticket.departureTrip.scheduleId._id, 
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
    
            if (ticket.returnTrip.scheduleId) {
                // Trả lại ghế cho chuyến đi về
                for (let seat of ticket.returnTrip.seatNumbers) {
                    // Cập nhật trạng thái ghế đã đặt thành chưa đặt
                    await ScheduleModel.updateOne(
                        { 
                            _id: ticket.returnTrip.scheduleId._id, 
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

            // Trả về kết quả
            res.status(200).send({ message: "Ticket cancelled successfully", ticket });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error cancelling the ticket" });
        }
    },

}

export default TicketController;