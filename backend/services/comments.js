import { v4 as uuidv4 } from 'uuid'
import SQL from '@nearform/sql'

import db from '../db/db'

/**
 * @typedef CreateCommentDto
 * @type {object}
 * @property {string} content - comment's content
 * @property {string} parentId - comment's parent id
 * @property {number} authorId - comment's author id
 */

/**
 * @typedef Comment
 * @type {object}
 * @property {string} id - comment's id
 * @property {string} content - comment's content
 * @property {string} publishedAt - when comment was published
 * @property {string} parentId - comment's parentId
 * @property {CommentAuthor} author - comment's author
 * @property {Comment[]} children - nested comments
 */

/**
 * @typedef CommentAuthor
 * @type {object}
 * @property {number} id - author's id
 * @property {string} firstName - author's first name
 * @property {string} lastName - author's last name
 * @property {string} avatarUrl - author's avatar URL
 */

/**
 * Post a comment
 * @param {CreateCommentDto} commentDto
 * @returns {Comment}
 */
async function createComment(commentDto) {
	const commentToSave = {
		content: commentDto.content,
		authorId: commentDto.authorId,
		publishedAt: new Date().toISOString(),
		id: uuidv4(),
		upvotes: 0,
		parentId: commentDto.parentId,
	}

	const query = SQL`
        INSERT INTO
            comments(id, content, author_id, published_at, upvotes, parent_id)
        VALUES(
            ${commentToSave.id},
            ${commentToSave.content},
            ${commentToSave.authorId},
            ${commentToSave.publishedAt},
            ${commentToSave.upvotes},
            ${commentToSave.parentId}
        )
        RETURNING *;
    `

	const result = await db.query(query)
	const createdComment = result.rows[0]

	return getCommentById(createdComment.id)
}

/**
 * Get a comment
 * @param {string} id
 * @returns {Comment}
 */
async function getCommentById(id) {
	const query = SQL`
		WITH children AS (
			SELECT
				c1.parent_id,
				COALESCE((
					SELECT json_agg(jsonb_build_object(
						'id', c2.id,
						'content', c2.content,
						'parentId', c2.parent_id,
						'publishedAt', c2.published_at,
						'upvotes', c2.upvotes,
						'children', COALESCE('[]'::json),
						'author', (SELECT json_agg(jsonb_build_object(
							'id', u.id,
							'firstName', u.first_name,
							'lastName', u.last_name,
							'avatarUrl', u.avatarurl)
						)->0 FROM users u WHERE u.id=c2.author_id)
					)) AS children
					FROM comments c2 INNER JOIN comments c3 ON c3.id=c2.parent_id
					WHERE c2.parent_id=c1.parent_id
				), '[]'::json) children
			FROM comments c1
			GROUP BY c1.parent_id
		),
		
		author AS (
			SELECT
				c1.author_id,
				COALESCE((
					SELECT json_agg(jsonb_build_object('id', users.id, 'firstName', users.first_name, 'lastName', users.last_name, 'avatarUrl', users.avatarurl))->0 AS author
					FROM users where users.id=c1.author_id
				), '[]'::json) author
			FROM comments c1
			GROUP BY c1.author_id
		)
		
		SELECT
			c.id as id,
			c.content as content,
			c.published_at as "publishedAt",
			c.parent_id as "parentId",
			c.upvotes as upvotes,
			a.author,
			COALESCE(ch.children, '[]'::json) children
		FROM comments c
		INNER JOIN author a
			ON c.author_id = a.author_id
		LEFT JOIN children ch
			ON c.id = ch.parent_id
		WHERE c.id=${id}
    `

	const queryCommentResult = await db.query(query)
	const comment = queryCommentResult.rows[0]

	return comment
}

/**
 * Get a comment
 * @returns {Comment[]}
 */
async function getAll() {
	const query = SQL`
		WITH children AS (
			SELECT
				c1.parent_id,
				COALESCE((
					SELECT json_agg(jsonb_build_object(
						'id', c2.id,
						'content', c2.content,
						'parentId', c2.parent_id,
						'publishedAt', c2.published_at,
						'upvotes', c2.upvotes,
						'children', COALESCE('[]'::json),
						'author', (SELECT json_agg(jsonb_build_object(
							'id', u.id,
							'firstName', u.first_name,
							'lastName', u.last_name,
							'avatarUrl', u.avatarurl)
						)->0 FROM users u WHERE u.id=c2.author_id)
					)) AS children
					FROM comments c2 INNER JOIN comments c3 ON c3.id=c2.parent_id
					WHERE c2.parent_id=c1.parent_id
				), '[]'::json) children
			FROM comments c1
			GROUP BY c1.parent_id
		),
		
		author AS (
			SELECT
				c1.author_id,
				COALESCE((
					SELECT json_agg(jsonb_build_object('id', users.id, 'firstName', users.first_name, 'lastName', users.last_name, 'avatarUrl', users.avatarurl))->0 AS author
					FROM users where users.id=c1.author_id
				), '[]'::json) author
			FROM comments c1
			GROUP BY c1.author_id
		)
		
		SELECT
			c.id as id,
			c.content as content,
			c.published_at as "publishedAt",
			c.parent_id as "parentId",
			c.upvotes as upvotes,
			a.author,
			COALESCE(ch.children, '[]'::json) children
		FROM comments c
		INNER JOIN author a
			ON c.author_id = a.author_id
		LEFT JOIN children ch
			ON c.id = ch.parent_id
    `

	const queryCommentsResult = await db.query(query)
	return queryCommentsResult.rows.map(({ author_id, ...rest }) => rest)
}

/**
 * Upvote a comment
 * @param {string} id
 */
async function upvoteCommentById(id) {
	console.log(id)
	const query = SQL`
		UPDATE comments SET upvotes = upvotes + 1 WHERE id = ${id}
	`

	return db.query(query)
}

export default { createComment, getAll, getCommentById, upvoteCommentById }
