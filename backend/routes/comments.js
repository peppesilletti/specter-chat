import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

const comments = []

router.get('/', function (req, res) {
	res.json(comments)
})

router.post('/', (req, res) => {
	const newComment = {
		...req.body,
		publishedAt: new Date().toISOString(),
		id: uuidv4(),
	}

	comments.push(newComment)
	res.status(201).json(newComment)
})

export default router
