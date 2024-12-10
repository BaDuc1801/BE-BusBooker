import BusModel from "../model/bus.schema.js";
import RouteModel from "../model/route.schema.js";
import ScheduleModel from "../model/schedule.schema.js";

const ScheduleController = {
    createSchedule: async (req, res) => {
        let { busId, routeId, startTime, endTime, price } = req.body;

        try {
            const bus = await BusModel.findById(busId);
            if (!bus) {
                return res.status(404).send({ message: "Bus not found" });
            }

            const totalSeats = bus.totalSeats; 

            let seats = [];
            if (totalSeats === 11) {
                const frontPrice = price.front;
                const middlePrice = price.middle;
                const backPrice = price.back;
                seats = [
                    ...Array.from({ length: 2 }, (_, i) => ({ seatNumber: `S${i + 1}`, location: 'front', price: frontPrice })),
                    ...Array.from({ length: 6 }, (_, i) => ({ seatNumber: `S${i + 3}`, location: 'middle', price: middlePrice })),
                    ...Array.from({ length: 3 }, (_, i) => ({ seatNumber: `S${i + 9}`, location: 'back', price: backPrice })),
                ];
            } else if (totalSeats === 9) {
                const frontPrice = price.front;
                const middlePrice = price.middle;
                const backPrice = price.back;

                seats = [
                    ...Array.from({ length: 2 }, (_, i) => ({ seatNumber: `S${i + 1}`, location: 'front', price: frontPrice })),
                    ...Array.from({ length: 4 }, (_, i) => ({ seatNumber: `S${i + 3}`, location: 'middle', price: middlePrice })),
                    ...Array.from({ length: 3 }, (_, i) => ({ seatNumber: `S${i + 7}`, location: 'back', price: backPrice })),
                ];
            } else {
                return res.status(400).send({ message: "Invalid bus capacity" });
            }

            let rs = await ScheduleModel.create({ busId, routeId, startTime, endTime, seats, price, availableSeats: totalSeats });
            await RouteModel.findByIdAndUpdate(routeId, { $push: { schedules: rs._id } });

            res.status(200).send(rs);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    getSchedulesByDate: async (req, res) => {
        const { startTime } = req.query;
        try {
            const startTimeObj = new Date(startTime);
            const startTimeString = startTimeObj.toISOString().split('T')[0];

            const schedules = await ScheduleModel.find({
                startTime: {
                    $gte: new Date(startTimeString),
                    $lt: new Date(new Date(startTimeString).setDate(startTimeObj.getDate() + 1))
                }
            }).populate("busId");

            res.status(200).send(schedules);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
// lúc đặt chỗ cần thêm thông tin người đặt
    bookSeat: async (req, res) => {
        const { scheduleId, seatNumber } = req.body; // Lấy scheduleId và seatNumber từ req.body
        try {
            // Tìm lịch trình dựa trên scheduleId
            const schedule = await ScheduleModel.findById(scheduleId);
            if (!schedule) {
                return res.status(404).json({ message: "Schedule not found" });
            }

            // Tìm ghế trong lịch trình
            const seat = schedule.seats.find(seat => seat.seatNumber === seatNumber);
            if (!seat) {
                return res.status(404).json({ message: "Seat not found" });
            }

            // Kiểm tra xem ghế đã được đặt chưa
            if (seat.isBooked) {
                return res.status(400).json({ message: "Seat is already booked" });
            }

            // Cập nhật trạng thái ghế
            seat.isBooked = true; // Đánh dấu ghế là đã đặt
            schedule.availableSeats -= 1; // Giảm số ghế còn lại

            // Lưu lại lịch trình đã cập nhật
            await schedule.save();

            return res.status(200).json({
                message: `Seat ${seatNumber} has been successfully booked`,
                scheduleId,
                seatNumber,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred", error });
        }
    },

    updateSchedule : async (req, res) => {
        let id = req.params.id;
        let data = req.body;
        let up = await ScheduleModel.findByIdAndUpdate({_id : id}, data, { new: true });
        res.status(200).send(up)
    }
}

export default ScheduleController;