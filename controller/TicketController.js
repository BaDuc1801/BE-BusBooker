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
            status
        } = req.body;
        let rs = await TicketModel.create({ phoneNumber, paymentMethod, departureTrip, returnTrip, price, userId, voucher, status });
        res.status(200).send(rs)
    },

    updateTicket: async (req, res) => {
        let { status, ticketId } = req.body;
        let rs = await TicketModel.findByIdAndUpdate({ _id: ticketId }, { status: status }, { new: true });
        res.status(200).send(rs)
    },

    getAllTicket: async (req, res) => {
        let rs = await TicketModel.find().populate('userId');
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

            // Cập nhật trạng thái cho vé
            for (const ticket of tickets) {
                const departureStartTime = ticket.departureTrip.scheduleId.startTime; // Lấy startTime từ scheduleId
                const returnEndTime = ticket.returnTrip.scheduleId ? ticket.returnTrip.scheduleId.endTime : null; // Lấy endTime từ returnTrip nếu có

                // Kiểm tra và cập nhật trạng thái
                if (departureStartTime < currentTime && ticket.status !== 'completed') {
                    ticket.status = 'completed';
                    await ticket.save();
                } else if (returnEndTime && returnEndTime < currentTime && ticket.status !== 'completed') {
                    ticket.status = 'completed';
                    await ticket.save();
                }
            }

            // Tìm vé theo userId
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
            }) ;

            // Kiểm tra xem có tìm thấy ticket không
            if (!ticket) {
                return res.status(404).send({ message: "Ticket not found" });
            }

            // Trả về vé đã được cập nhật
            res.status(200).send(ticket);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal server error" });
        }
    },
}

export default TicketController;