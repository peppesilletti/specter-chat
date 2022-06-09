import React from 'react'
import ReactDOM from 'react-dom'
import formatDistance from 'date-fns/formatDistance'

import Upvotes from './Upvotes'

function render({
	comment,
	onUpvoteComment,
	onReplyClick,
	style = '',
	isMainComment = false,
}) {
	const commentEl = document.createElement('div')

	const commentHtml = `
		<div class="comment-container" id="comment-${comment.id}" style=${style}>
			<div class="comment-container-left">
				<img src="${comment.author.avatarUrl}" alt="Avatar" class="avatar">
				<div style="margin-left:18px;margin-top:2px;">
					<div class="vl" style=${!isMainComment ? `display:none` : ``}></div>
				</div>
			</div>

			<div class="comment-container-right">
				<div class="main-comment-container">
					<div class="comment-container-header">
						<div class="comment-container-header-author">
							${comment.author.firstName} ${comment.author.lastName}
						</div>
						<div class="comment-container-header-separator">&bull;</div>
						<div class="comment-container-header-published">
							${formatDistance(new Date(comment.publishedAt), new Date(), {
								addSuffix: true,
							})}
						</div>
						<div class="comment-container-header-separator">&bull;</div>
						<div class="comment-container-header-upvotes">
							Upvoted <span class="comment-container-header-upvotes-value"></span> times
						</div>
					</div>

					<div class="comment-container-content">
						${comment.content}
					</div>

					<div class="comment-actions-container">
						<div class="comment-actions-container-upvote" data-testid="upvote-comment">
							<div class="comment-actions-container-upvote-icon">&#9652;</div>
							<div>Upvote</div>
						</div>
						<div class="comment-actions-container-reply">Reply</div>
					</div>
				</div>
			</div>
		</div>
	`

	commentEl.innerHTML = commentHtml

	const upvoteButtonEl = commentEl.getElementsByClassName(
		'comment-actions-container-upvote',
	)[0]

	const replyButtonEl = commentEl.getElementsByClassName(
		'comment-actions-container-reply',
	)[0]

	upvoteButtonEl.addEventListener(
		'click',
		() => onUpvoteComment(comment),
		false,
	)

	replyButtonEl.addEventListener('click', () => onReplyClick(comment), false)

	// Render the upvotes with React
	const upvotesEl = commentEl.getElementsByClassName(
		'comment-container-header-upvotes-value',
	)[0]

	ReactDOM.render(
		React.createElement(Upvotes, { upvotes: comment.upvotes }),
		upvotesEl,
	)

	return commentEl
}

export default { render }
