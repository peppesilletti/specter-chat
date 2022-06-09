import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import users from '../fixtures/users.json'

const router = express.Router()

const comments = []

router.get('/', function (req, res) {
	res.json(comments.map(_mapStoreCommentToCommentResponseDto))
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

	if (!_userWithIdExists({ id: authorId })) {
		return res.status(400).json({
			message: `Author with id ${authorId} does not exist`,
			field: 'authorId',
		})
	}

	const commentToSave = {
		content: req.body.content,
		authorId: req.body.authorId,
		publishedAt: new Date().toISOString(),
		id: uuidv4(),
		upvotes: 0,
	}

	comments.push(commentToSave)

	res.status(201).json(_mapStoreCommentToCommentResponseDto(commentToSave))
})

router.post('/:id/upvote', (req, res) => {
	const { id } = req.params
	const missingParamErrorMsg = `Comment with id ${id} does not exist`

	if (!_commentWithIdExists({ id })) {
		return res.status(400).json({ message: missingParamErrorMsg, param: 'id' })
	}

	const commentToUpvoteIndex = comments.findIndex(comment => comment.id === id)
	comments[commentToUpvoteIndex].upvotes =
		comments[commentToUpvoteIndex].upvotes + 1

	req.app.io.emit('COMMENT_UPVOTED', { commentId: id })

	res.sendStatus(200)
})

function _userWithIdExists({ id }) {
	return users.some(user => user.id === id)
}

function _commentWithIdExists({ id }) {
	return comments.some(comment => comment.id === id)
}

function _mapStoreCommentToCommentResponseDto(comment) {
	return {
		id: comment.id,
		content: comment.content,
		publishedAt: comment.publishedAt,
		author: users.find(user => user.id === comment.authorId),
		upvotes: comment.upvotes,
	}
}

export default router
