/**
 * @typedef CreateCommentDto
 * @type {object}
 * @property {string} content - comment's content
 * @property {number} authorId - comment's author id
 */

/**
 * @typedef Comment
 * @type {object}
 * @property {string} id - comment's id
 * @property {string} content - comment's content
 * @property {string} publishedAt - when comment was published
 * @property {CommentAuthor} author - comment's author
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
 * Get all the comments
 * @returns {Comment[]}
 */
export async function getComments() {
	const rawResponse = await fetch('http://localhost:3001/api/comments')

	// fake some latency
	// pause(2000)

	return rawResponse.json()
}

/**
 * Post a comment
 * @param {CreateCommentDto} commentDto
 * @returns {Comment}
 */
export async function postComment(commentDto) {
	const rawResponse = await fetch('http://localhost:3001/api/comments', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			content: commentDto.content,
			authorId: commentDto.authorId,
		}),
	})

	// fake some latency
	// pause(2000)

	return rawResponse.json()
}

function pause(milliseconds) {
	var dt = new Date()
	while (new Date() - dt <= milliseconds) {
		/* Do nothing */
	}
}
