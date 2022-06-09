import React from 'react'
import ReactDOM from 'react-dom'
import { io } from 'socket.io-client'

import formatDistance from 'date-fns/formatDistance'
import { getComments, postComment, upvoteComment } from './api'

import Upvotes from './Upvotes'

import './style.css'

// Elements refs
const createCommentInputEl = document.getElementById('create-comment-input')
const createCommentButtonEl = document.getElementById('create-comment-button')
const commentsListDocEl = document.getElementById('comments-container')
const loaderEl = document.getElementById('loader')

function init() {
	const socket = io('http://localhost:3001')

	socket.on('COMMENT_UPVOTED', ({ commentId }) => {
		_increaseCommentUpvotes(commentId)
	})

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
		createdComment = await postComment({
			content,
			authorId: Math.floor(Math.random() * 3) + 1,
		})
	} catch {
		alert("It's not possible to add a comment at the moment. Try later")
	} finally {
		stopLoading()
	}

	_addCommentToCommentList(createdComment)
}

async function onUpvoteComment(comment) {
	try {
		await upvoteComment(comment.id)
	} catch {
		alert("It's not possible to upvote the comment at the moment. Try later")
	}
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
		<div class="comment-container" id="comment-${comment.id}">
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
	`

	const upvoteButtonEl = commentEl.getElementsByClassName(
		'comment-actions-container-upvote',
	)[0]

	upvoteButtonEl.addEventListener(
		'click',
		() => onUpvoteComment(comment),
		false,
	)

	commentsListDocEl.appendChild(commentEl)

	// Render the upvotes with React
	const upvotesEl = commentEl.getElementsByClassName(
		'comment-container-header-upvotes-value',
	)[0]

	ReactDOM.render(
		React.createElement(Upvotes, { upvotes: comment.upvotes }),
		upvotesEl,
	)

	createCommentInputEl.value = ''
}

function _increaseCommentUpvotes(commentId = '') {
	const commentEl = document.getElementById(`comment-${commentId}`)

	const currentUpvotesValueEl = commentEl.getElementsByClassName(
		'comment-container-header-upvotes-value',
	)[0]

	const newUpvotesValue = `${parseInt(currentUpvotesValueEl.innerHTML) + 1}`

	ReactDOM.render(
		React.createElement(Upvotes, { upvotes: newUpvotesValue }),
		currentUpvotesValueEl,
	)
}

init()
