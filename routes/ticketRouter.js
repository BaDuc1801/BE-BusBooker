import express from "express"
import TicketController from "../controller/TicketController.js";

const ticketRouter = express.Router();

ticketRouter.post('/', TicketController.postTicket);
ticketRouter.get('/all', TicketController.getAllTicket);
ticketRouter.put('/', TicketController.updateTicket);
ticketRouter.get('/userId/:id', TicketController.getTicketById);

export default ticketRouter