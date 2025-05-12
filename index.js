import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRouter from './routes/userRouter.js';
import routeRouter from './routes/routeRouter.js';
import busRouter from './routes/busRouter.js';
import scheduleRouter from './routes/scheduleRouter.js';
import voucherRouter from './routes/voucherRouter.js';
import ticketRouter from './routes/ticketRouter.js';
import notiRouter from './routes/notiRouter.js';
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGOCONNECT)

const corsOptions = {
    origin: ['http://localhost:3000', 'https://be-bus-booker.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', userRouter)
app.use('/routes', routeRouter)
app.use('/bus', busRouter)
app.use('/schedule', scheduleRouter)
app.use('/vouchers', voucherRouter)
app.use('/tickets', ticketRouter)
app.use('/noti', notiRouter)

app.get("/", (req, res) => {
    res.status(200).json({ message: "hello" });
});

app.listen(8080, () => {
    console.log("Server is running")
})