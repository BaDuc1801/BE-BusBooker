import express from 'express'
import BusController from '../controller/BusController.js';
import multer from 'multer';

const busRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
})

busRouter.put('/img/:id', upload.array('img'), BusController.uploadImgItem);
busRouter.put('/update/:id', BusController.updateBus);
busRouter.post('/add', BusController.createBus)

export default busRouter