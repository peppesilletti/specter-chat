import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import { Server } from 'socket.io'

import commentsRouter from './routes/comments'

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(express.json())

app.use('/api/comments', commentsRouter)

export default app
