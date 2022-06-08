import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import users from '../fixtures/users.json'

const router = express.Router()

const comments = []

router.get('/', function (req, res) {
	res.json(comments)
})

router.post('/', (req, res) => {
	const { authorId, content } = req.body
	const missingParamErrorMsg = 'Missing parameter in comment dto'

	if (!authorId) {
		return res
			.status(400)
			.json({ message: missingParamErrorMsg, field: 'authorId' })
	}

	if (!content) {
		return res
			.status(400)
			.json({ message: missingParamErrorMsg, field: 'content' })
	}

	if (!userWithIdExists({ id: authorId })) {
		return res.status(400).json({
			message: `Author with id ${authorId} does not exist`,
			field: 'authorId',
		})
	}

	const newComment = {
		...req.body,
		publishedAt: new Date().toISOString(),
		id: uuidv4(),
	}

	comments.push(newComment)
	res.status(201).json(newComment)
})

function userWithIdExists({ id }) {
	return users.some(user => user.id === id)
}

export default router
