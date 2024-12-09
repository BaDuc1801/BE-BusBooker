import express from 'express'
import BusController from '../controller/BusController.js';
import multer from 'multer';

const busRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
})

busRouter.put('/img/:id', upload.array('img'), BusController.uploadImgItem);
busRouter.put('/:id', BusController.updateBus);
busRouter.post('/post11', BusController.addBus11);
busRouter.post('/post9', BusController.addBus9);

export default busRouter