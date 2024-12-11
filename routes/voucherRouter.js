import express from 'express';
import voucherController from '../controller/VoucherController.js';
import userMiddleware from '../middleware/userMiddleware.js';

const voucherRouter = express.Router();

voucherRouter.post('/create', userMiddleware.verifyToken, userMiddleware.checkRole, voucherController.createVoucher);

export default voucherRouter;
