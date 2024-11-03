import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import testRoutes from './routes/testRoutes.js'
import ContributorRoutes from './routes/contributorRoutes.js'
import noteRoutes from './routes/NoteRoutes.js'
import cookieParser from 'cookie-parser'
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import cors from 'cors'
import chatApp from './utilis/chatApp.js'
dotenv.config()


connectDb();

const PORT = process.env.PORT || 5000;

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({
    origin:[ "*", 'https://web-app-six-gules.vercel.app', 'http://localhost:3000'],
    credentials: true
}))

app.use('/api/users',userRoutes)
app.use('/api/test',testRoutes)
app.use('/api/contributor',ContributorRoutes)
app.use('/api/notes',noteRoutes)

const server = http.createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: ['*', 'https://web-app-six-gules.vercel.app', 'http://localhost:3000'],
    credentials: true,
  },
});

chatApp()
server.listen(PORT,() => {
    console.log(`App is running on PORT ${PORT}`)
})

export default app
