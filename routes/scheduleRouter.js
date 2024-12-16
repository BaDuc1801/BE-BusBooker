import express from 'express'
import ScheduleController from '../controller/ScheduleController.js';

const scheduleRouter = express.Router();

scheduleRouter.post('/', ScheduleController.createSchedule);
scheduleRouter.get('/', ScheduleController.getSchedulesByDate);
scheduleRouter.get('/all', ScheduleController.getSchedules);
scheduleRouter.put('/book-seat', ScheduleController.bookSeat);
scheduleRouter.put('/update/:id', ScheduleController.updateSchedule);
scheduleRouter.delete('/:id', ScheduleController.delSchedule);

export default scheduleRouter;