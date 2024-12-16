import RouteModel from "../model/route.schema.js";

const RouteController = {
    createRoute: async (req, res) => {
        let { img, origin, destination, basisPrice, afterDiscount } = req.body;
        let newRoute = await RouteModel.create({ img, origin, destination, basisPrice, afterDiscount });
        res.status(200).send(newRoute)
    },

    getRoutes: async (req, res) => {
        let rs = await RouteModel.find();
        res.status(200).send(rs)
    },

    updateRoute: async (req, res) => {
        let route = req.body;
        let routeId = req.params.id;
        let rs = await RouteModel.findByIdAndUpdate(
            {_id: routeId},
            route,
            {new: true}
        )
        res.status(200).send(rs)
    },

    updateRouteBySchedule: async (req, res) => {
        const { routeId, scheduleId } = req.body;
        const route = await RouteModel.findById(routeId);
        if (route.schedules.includes(scheduleId)) {
            return res.status(400).send({ message: "scheduleId đã tồn tại" });
        }
        route.schedules.push(scheduleId);
        await route.save();
        res.status(200).send(route );
    },

    getRoutesById: async (req, res) => {
        let routeId = req.params.id;
        let rs = await RouteModel.findById(routeId).populate("schedules");
        res.status(200).send(rs)
    },

    searchSchedule: async (req, res) => {
        const { startTime = null, origin, destination } = req.query; 
        try {
             if (!startTime) {
                const routes = await RouteModel.find({ origin, destination }).populate({
                    path: 'schedules',
                    populate: {
                        path: 'busId'
                    }
                });
                return res.status(200).json(routes);
            }

            const startTimeObj = new Date(startTime);
            const startTimeString = startTimeObj.toISOString().split('T')[0]; 

            const route = await RouteModel.find({
                origin: origin,
                destination: destination
            })
                .populate({
                    path: 'schedules',
                    match: {
                        startTime: {
                            $gte: new Date(startTimeString), 
                            $lt: new Date(new Date(startTimeString).setDate(startTimeObj.getDate() + 1))
                        }
                    },
                    populate: {
                        path: 'busId',
                    },
                });

            if (!route) {
                return res.status(404).json({ message: 'Route not found' });
            }

            res.status(200).json(route);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    delRoute: async (req, res) => {
        let userId = req.params.id;
        let rs = await RouteModel.findByIdAndDelete(
            {_id: userId}
        )
        res.status(200).send(rs) 
    }
}

export default RouteController;