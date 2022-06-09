import tap from 'tap'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import app from '../app'

import users from '../fixtures/users.json'

tap.test('Comments API', t => {
	tap.test('Create and fetch comments - Happy Path', async t => {
		// Create comment
		const commentToCreate = createCommentDto({
			overrides: {
				authorId: users[0].id,
			},
		})

		const addCommentResponse = await request(app)
			.post('/api/comments')
			.send(commentToCreate)
			.set('Accept', 'application/json')

		const expectedAddedComment = {
			content: commentToCreate.content,
			author: {
				id: 1,
				firstName: 'Jon',
				lastName: 'Snow',
				avatarUrl: String,
			},
			id: String,
			publishedAt: String,
			upvotes: 0,
		}

		const createdComment = addCommentResponse.body
		t.same(addCommentResponse.status, 201)
		t.match(createdComment, expectedAddedComment)

		// Get comments
		const getCommentsResponse = await request(app)
			.get('/api/comments')
			.set('Accept', 'application/json')

		t.same(getCommentsResponse.status, 200)

		const fetchedCreatedComment = getCommentsResponse.body.find(
			comment => comment.id === createdComment.id,
		)
		t.match(fetchedCreatedComment, createdComment)

		t.end()
	})

	tap.test(
		"Create Comment - It should return an error if the author's id is not sent when creating a comment",
		async t => {
			const addCommentResponse = await request(app)
				.post('/api/comments')
				.send(createCommentDto())
				.set('Accept', 'application/json')

			t.same(addCommentResponse.status, 400)
			t.same(addCommentResponse.body, {
				message: 'Missing parameter in comment dto',
				field: 'authorId',
			})

			t.end()
		},
	)

	tap.test(
		'Create Comment - It should return an error if the content is not sent when creating a comment',
		async t => {
			const addCommentResponse = await request(app)
				.post('/api/comments')
				.send({ authorId: 1 })
				.set('Accept', 'application/json')

			t.same(addCommentResponse.status, 400)
			t.same(addCommentResponse.body, {
				message: 'Missing parameter in comment dto',
				field: 'content',
			})

			t.end()
		},
	)

	tap.test(
		'Create Comment - It should return an error if author does not exist',
		async t => {
			const notExistingAuthorId = 100

			const addCommentResponse = await request(app)
				.post('/api/comments')
				.send(
					createCommentDto({
						overrides: { authorId: notExistingAuthorId },
					}),
				)
				.set('Accept', 'application/json')

			t.same(addCommentResponse.status, 400)
			t.same(addCommentResponse.body, {
				message: `Author with id ${notExistingAuthorId} does not exist`,
				field: 'authorId',
			})

			t.end()
		},
	)

	tap.test('Upvote a comment - Happy Path', async t => {
		// Create comment
		const commentToCreate = createCommentDto({
			overrides: {
				authorId: users[0].id,
			},
		})

		const addCommentResponse = await request(app)
			.post('/api/comments')
			.send(commentToCreate)
			.set('Accept', 'application/json')

		const createdComment = addCommentResponse.body

		const upvoteCommentResponse = await request(app).post(
			`/api/comments/${createdComment.id}/upvote`,
		)

		t.same(upvoteCommentResponse.status, 200)

		// Get comments
		const getCommentsResponse = await request(app)
			.get('/api/comments')
			.set('Accept', 'application/json')

		const createdCommentWithNewUpvotes = getCommentsResponse.body.find(
			comment => comment.id === createdComment.id,
		)
		t.match(createdCommentWithNewUpvotes, { ...createdComment, upvotes: 1 })

		t.end()
	})

	tap.test(
		'Upvote a comment - It should return an error if comment id does not exist',
		async t => {
			const notExistingCommentId = 100

			const upvoteCommentResponse = await request(app).post(
				`/api/comments/${notExistingCommentId}/upvote`,
			)

			t.same(upvoteCommentResponse.status, 400)
			t.same(upvoteCommentResponse.body, {
				message: `Comment with id ${notExistingCommentId} does not exist`,
				param: 'id',
			})

			t.end()
		},
	)

	t.end()
})

function createCommentDto({ overrides = {} } = {}) {
	return {
		content: faker.random.words(),
		...overrides,
	}
}
