import { getComments, postComment } from './api'
import formatDistance from 'date-fns/formatDistance'
import './style.css'

// Elements refs
const createCommentInputEl = document.getElementById('create-comment-input')
const createCommentButtonEl = document.getElementById('create-comment-button')
const commentsListDocEl = document.getElementById('comments-container')
const loaderEl = document.getElementById('loader')

function init() {
	createCommentButtonEl.addEventListener('click', onAddComment, false)
	createCommentInputEl.addEventListener(
		'keydown',
		e => {
			if (e.key == 'Enter') {
				onAddComment()
			}
		},
		false,
	)

	renderComments()
}

async function renderComments() {
	let comments

	startLoading('Fetching comments...')
	try {
		comments = await getComments()
	} catch {
		alert("It's not possible to load the comments at the moment. Try later")
	} finally {
		stopLoading()
	}

	comments.forEach(_addCommentToCommentList)
}

async function onAddComment() {
	let createdComment

	const content = createCommentInputEl.value
	if (!content) return

	try {
		startLoading('Adding comment...')
		createdComment = await postComment({ content, authorId: 1 })
	} catch {
		alert("It's not possible to add a comment at the moment. Try later")
	} finally {
		stopLoading()
	}

	_addCommentToCommentList(createdComment)
}

function startLoading(loadingMessage = '') {
	createCommentInputEl.disabled = true
	createCommentButtonEl.disabled = true
	loaderEl.innerHTML = loadingMessage
}

function stopLoading() {
	createCommentInputEl.disabled = false
	createCommentButtonEl.disabled = false
	loaderEl.innerHTML = ''
}

function _addCommentToCommentList(comment) {
	const commentEl = document.createElement('div')

	commentEl.innerHTML = `
		<div class="comment-container">
			<div class="comment-container-left">
				<img src="${comment.author.avatarUrl}" alt="Avatar" class="avatar">
			</div>

			<div class="comment-container-right">
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
				</div>

				<div class="comment-container-content">
					${comment.content}
				</div>

				<div class="comment-actions-content">
					<div class="comment-actions-content-upvote">
						<div class="comment-actions-content-upvote-icon">&#9652;</div>
						<div>Upvote</div>
					</div>
					<div class="comment-actions-content-reply">Reply</div>
				</div>
			</div>
		</div>
	`

	commentsListDocEl.appendChild(commentEl)
	createCommentInputEl.value = ''
}

init()
