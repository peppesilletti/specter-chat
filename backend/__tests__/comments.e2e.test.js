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
				avatarUrl: 'https://i.pravatar.cc/300',
			},
			id: String,
			publishedAt: String,
		}

		t.same(addCommentResponse.status, 201)
		t.match(addCommentResponse.body, expectedAddedComment)

		// Get comments
		const getCommentsResponse = await request(app)
			.get('/api/comments')
			.set('Accept', 'application/json')

		t.same(getCommentsResponse.status, 200)
		t.match(getCommentsResponse.body, [expectedAddedComment])

		t.end()
	})

	tap.skip(
		"It should return an error if the author's id is not sent when creating a comment",
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

	tap.skip(
		'It should return an error if the content is not sent when creating a comment',
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

	tap.skip('It should return an error if author does not exist', async t => {
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
	})

	t.end()
})

function createCommentDto({ overrides = {} } = {}) {
	return {
		content: faker.random.words(),
		...overrides,
	}
}
