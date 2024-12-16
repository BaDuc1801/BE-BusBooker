import express from 'express'
import RouteController from '../controller/RouteController.js';

const routeRouter = express.Router();

routeRouter.post('/', RouteController.createRoute);
routeRouter.get('/', RouteController.getRoutes);
routeRouter.put('/:id', RouteController.updateRoute);
routeRouter.post('/push-schedule/', RouteController.updateRouteBySchedule);
routeRouter.get('/get-route/:id', RouteController.getRoutesById);
routeRouter.get('/find-schedule',RouteController.searchSchedule);
routeRouter.delete('/:id', RouteController.delRoute)

export default routeRouter;