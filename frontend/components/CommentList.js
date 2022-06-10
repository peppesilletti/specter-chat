import Comment from './Comment'
import CommentForm from './CommentForm'
import U from './utils'

function render({ comments, onUpvoteComment, onAddComment, style = '' }) {
	const commentListEl = document.createElement('div')

	function renderReplyForm(onAddComment) {
		const commentFormContainerEl = document.createElement('div')
		const commentFormEl = CommentForm.render({
			onAddComment,
			style: 'margin-left:50px',
		})

		commentFormContainerEl.appendChild(commentFormEl)
		commentFormContainerEl.style = 'display:none;'

		return commentFormContainerEl
	}

	// Only handle one level of nesting
	comments
		.filter(comment => !comment.parentId)
		.forEach(comment => {
			const replyFormEl = renderReplyForm(async commentContent => {
				await onAddComment({ commentContent, parentId: comment.id })
				commentFormContainerEl.remove()
			})

			const commentEl = Comment.render({
				comment,
				onUpvoteComment,
				onReplyClick: () => {
					console.log(replyFormEl.style.display)
					replyFormEl.style.display === 'none'
						? (replyFormEl.style = 'display: block;')
						: (replyFormEl.style = 'display: none;')
				},
			})

			commentListEl.appendChild(commentEl)

			U.insertAfter(replyFormEl, commentEl)

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
