import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()


connectDb()
const PORT = process.env.PORT || 5000


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:3000", "https://poe-therapy.vercel.app"],
    credentials: true
}))

app.use('/api/users',userRoutes)


export default app
