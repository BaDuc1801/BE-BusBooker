import { response } from "express";
import RouteModel from "../model/route.schema.js";

const RouteController = {
    createRoute: async (req, res) => {
        let { img, origin, destination, basisPrice, afterDiscount } = req.body;
        let newRoute = await RouteModel.create( { img, origin, destination, basisPrice, afterDiscount });
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
            routeId,
            route,
        )
        res.status(200).send(rs)
    },

    getRoutesById: async (req, res) => {
        let routeId = req.params.id;
        let rs = await RouteModel.findById(routeId);
        res.status(200).send(rs)
    }
}

export default RouteController;