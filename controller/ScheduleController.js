import ScheduleModel from "../model/schedule.schema.js";

const ScheduleController = {
    createSchedule : async (req, res) => {
        let {busId, routeId, startTime, endTime} = req.body;
        let rs = await ScheduleModel.create({busId, routeId, startTime, endTime})
        res.status(200).send(rs)
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
            });

            res.status(200).send(schedules);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
}

export default ScheduleController;