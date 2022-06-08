import express from 'express'
import logger from 'morgan'

import commentsRouter from './routes/comments'

const app = express()

app.use(logger('dev'))
app.use(express.json())

app.use('/api/comments', commentsRouter)

export default app
