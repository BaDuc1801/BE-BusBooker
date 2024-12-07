import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRouter from './routes/userRouter.js';
import routeRouter from './routes/routeRouter.js';

await mongoose.connect('mongodb+srv://minhduc180104:minhduc180104@learnmongo.zli6q.mongodb.net/BusBooker?retryWrites=true&w=majority&appName=LearnMongo')

const app = express();
app.use(express.json());
app.use(cors());

app.use('/users', userRouter)
app.use('/routes', routeRouter)

app.listen(8080, () => {
    console.log("Server is running")
})