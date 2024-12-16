import express from 'express';
import NotiController from '../controller/NotiController.js';

const notiRouter = express.Router()

notiRouter.get('/all', NotiController.getNoti);
notiRouter.get('/id/:id', NotiController.getNotiById);
notiRouter.post('/', NotiController.postNoti);
notiRouter.put('/:id', NotiController.readNoti);

export default notiRouter;