import express from 'express'
import RouteController from '../controller/RouteController.js';

const routeRouter = express.Router();

routeRouter.post('/', RouteController.createRoute);
routeRouter.get('/', RouteController.getRoutes);
routeRouter.put('/:id', RouteController.updateRoute);
routeRouter.get('/:id', RouteController.getRoutesById);

export default routeRouter;