import express from 'express'
import asyncHandler from 'express-async-handler'
import commentsService from '../services/comments'
import usersService from '../services/users'

const router = express.Router()

const comments = []

router.get(
	'/',
	asyncHandler(async (req, res) => {
		const comments = await commentsService.getAll()
		res.status(200).json(comments)
	}),
)

router.post(
	'/',
	asyncHandler(async (req, res) => {
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

		const doesUserExist = await _userWithIdExists({ id: authorId })
		if (doesUserExist) {
			return res.status(400).json({
				message: `Author with id ${authorId} does not exist`,
				field: 'authorId',
			})
		}

		const createdComment = await commentsService.createComment(req.body)

		res.status(201).json(createdComment)
	}),
)

router.post(
	'/:id/upvote',
	asyncHandler(async (req, res) => {
		const { id } = req.params
		const missingParamErrorMsg = `Comment with id ${id} does not exist`

		const doesCommentExists = await _commentWithIdExists({ id })
		if (!doesCommentExists) {
			return res
				.status(400)
				.json({ message: missingParamErrorMsg, param: 'id' })
		}

		await commentsService.upvoteCommentById(id)

		req.app.io && req.app.io.emit('COMMENT_UPVOTED', { commentId: id })

		res.sendStatus(200)
	}),
)

async function _commentWithIdExists({ id }) {
	const comment = await commentsService.getCommentById(id)
	return !!comment
}

async function _userWithIdExists({ id }) {
	const user = await usersService.getById(id)
	return !user
}

export default router
