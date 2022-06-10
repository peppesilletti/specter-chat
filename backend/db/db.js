import dotEnv from 'dotenv-flow'
dotEnv.config()

import pkg from 'pg'
const { Client } = pkg

const config =
	process.env.NODE_ENV === 'production'
		? {
				connectionString: process.env.DATABASE_URL,
				ssl: {
					rejectUnauthorized: false,
				},
		  }
		: {}

const db = new Client(config)

export default db
