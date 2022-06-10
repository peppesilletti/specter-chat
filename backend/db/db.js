import dotEnv from 'dotenv-flow'
dotEnv.config()

import pkg from 'pg'
const { Client } = pkg

const db = new Client()

export default db
