import express from 'express'

const router = express.Router()

router.get('/', function (req, res) {
	res.json([
		{
			id: 1,
			author: 'John Doe',
			publishedAt: new Date(),
			content: 'I am a comment!',
			upvotes: 0,
		},
		{
			id: 2,
			author: 'John Doe',
			publishedAt: new Date(),
			content: 'I am a comment!',
			upvotes: 0,
		},
		{
			id: 3,
			author: 'John Doe',
			publishedAt: new Date(),
			content: 'I am a comment!',
			upvotes: 0,
		},
	])
})

export default router
