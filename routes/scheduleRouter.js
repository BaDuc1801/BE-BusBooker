import express from 'express'
import ScheduleController from '../controller/ScheduleController.js';

const scheduleRouter = express.Router();

scheduleRouter.post('/', ScheduleController.createSchedule);
scheduleRouter.get('/', ScheduleController.getSchedulesByDate);
scheduleRouter.put('/book-seat', ScheduleController.bookSeat);
scheduleRouter.put('/update/:id', ScheduleController.updateSchedule);

export default scheduleRouter;