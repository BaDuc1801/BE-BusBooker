import express from 'express'
import ScheduleController from '../controller/ScheduleController.js';

const scheduleRouter = express.Router();

scheduleRouter.post('/', ScheduleController.createSchedule);
scheduleRouter.get('/', ScheduleController.getSchedulesByDate);
// scheduleRouter.put('/:id', ScheduleController.updateRoute);
// scheduleRouter.get('/:id', ScheduleController.getRoutesById);

export default scheduleRouter;