import tap from 'tap'
import request from 'supertest'
import app from '../app'

tap.test('Comments API', async () => {
	const response = await request(app)
		.get('/users')
		.set('Accept', 'application/json')

	expect(response.status).toEqual(200)
	expect(response.body.email).toEqual('foo@bar.com')
})
