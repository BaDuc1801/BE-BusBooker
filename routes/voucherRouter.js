import express from 'express';
import voucherController from '../controller/VoucherController.js';
import userMiddleware from '../middleware/userMiddleware.js';

const voucherRouter = express.Router();

voucherRouter.post('/create', userMiddleware.verifyToken, userMiddleware.checkRole, voucherController.createVoucher);
voucherRouter.get('/', voucherController.getVouchers);
voucherRouter.put('/:id', voucherController.updateVoucher);
voucherRouter.delete('/:id',voucherController.delVoucher);

export default voucherRouter;
