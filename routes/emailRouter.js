import express from 'express';
import EmailController from '../controller/EmailController.js';

const emailRouter = express.Router()

emailRouter.post('/', EmailController.sendEmail);

export default emailRouter