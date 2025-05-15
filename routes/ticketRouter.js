import express from "express"
import TicketController from "../controller/TicketController.js";
import userMiddleware from "../middleware/userMiddleware.js";

const ticketRouter = express.Router();

ticketRouter.post('/', TicketController.postTicket);
ticketRouter.get('/all', TicketController.getAllTicket);
ticketRouter.put('/', TicketController.updateTicket);
ticketRouter.put('/cancel', TicketController.cancelTicket);
ticketRouter.get('/userId', userMiddleware.verifyToken,TicketController.getTicketById);
ticketRouter.post('/review', TicketController.addReview);

export default ticketRouter