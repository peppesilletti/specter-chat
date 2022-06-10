import SQL from '@nearform/sql'
import db from '../db/db'

/**
 * @typedef User
 * @type {object}
 * @property {number} id - author's id
 * @property {string} firstName - author's first name
 * @property {string} lastName - author's last name
 * @property {string} avatarUrl - author's avatar URL
 */

/**
 * Get a user
 * @param {string} id
 * @returns {User}
 */
async function getById(id = '') {
	const query = SQL`SELECT * FROM users WHERE id=${id}`

	const result = await db.query(query)
	return result.rows[0] || null
}

export default { getById }
