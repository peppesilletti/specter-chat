import Comment from './Comment'
import U from './utils'

function render({ comments, onReplyClick, onUpvoteComment, style = '' }) {
	const commentListEl = document.createElement('div')

	// Only handle one level of nesting
	comments.forEach(comment => {
		const commentEl = Comment.render({
			comment,
			onUpvoteComment,
			onReplyClick,
		})

		if (!comment.parentId) {
			commentListEl.appendChild(commentEl)
		}

		if (comment?.children?.length > 0) {
			comment.children.forEach(nestedComment => {
				const nestedCommentEl = Comment.render({
					comment: nestedComment,
					onUpvoteComment,
				})

				nestedCommentEl
					.getElementsByClassName('comment-actions-container-reply')[0]
					.remove()

				U.insertAfter(
					nestedCommentEl,
					commentEl.getElementsByClassName('main-comment-container')[0],
				)
			})
		}
	})

	return commentListEl
}

export default { render }
