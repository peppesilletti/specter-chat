import tap from 'tap'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import app from '../app'

import users from '../fixtures/users.json'

tap.test('Comments API', async () => {
	tap.test('Comments CRUD - Happy Path', async () => {
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

		tap.same(addCommentResponse.status, 201)
		tap.match(addCommentResponse.body, {
			...commentToCreate,
			id: String,
			publishedAt: String,
		})

		// Get comments
		const getCommentsResponse = await request(app)
			.get('/api/comments')
			.set('Accept', 'application/json')

		tap.same(getCommentsResponse.status, 200)
		tap.match(getCommentsResponse.body, [addCommentResponse.body])

		tap.end()
	})

	tap.end()
})

function createCommentDto({ overrides = {} } = {}) {
	return {
		content: faker.random.words(),
		...overrides,
	}
}
