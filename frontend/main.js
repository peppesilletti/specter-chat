import { io } from 'socket.io-client'
import React from 'react'
import ReactDOM from 'react-dom'
import Upvotes from './components/Upvotes'

import { getComments, postComment, upvoteComment } from './api'

import CommentForm from './components/CommentForm'
import Comment from './components/Comment'

import './style.css'

// Elements refs
const commentsListDocEl = document.getElementById('comments-container')
const loaderEl = document.getElementById('loader')

function onMounted() {
	const socket = io('http://localhost:3001')

	socket.on('COMMENT_UPVOTED', ({ commentId }) => {
		_increaseCommentUpvotes(commentId)
	})

	render()
}

async function render() {
	let comments

	const commentsFormContainerEl = document.getElementById(
		'comments-form-container',
	)
	const commentFormEl = CommentForm.render({
		containerElId: '',
		onAddComment: commentContent => onAddComment({ commentContent }),
	})
	commentsFormContainerEl.appendChild(commentFormEl)

	startLoading('Fetching comments...')
	try {
		comments = await getComments()
	} catch {
		alert("It's not possible to load the comments at the moment. Try later")
	} finally {
		stopLoading()
	}

	// Only handling one level of nesting
	comments.forEach(renderCommentInList)
}

function renderCommentInList(comment) {
	if (comment.parentId) {
		const commentEl = Comment.render({
			comment,
			onUpvoteComment,
			onReplyClick,
		})

		commentEl
			.getElementsByClassName('comment-actions-container-reply')[0]
			.remove()

		const existingCommentEl = document
			.getElementById(`comment-${comment.parentId}`)
			.getElementsByClassName('main-comment-container')[0]

		_insertAfter(commentEl, existingCommentEl)
		return
	}

	const commentEl = Comment.render({
		comment,
		onUpvoteComment,
		onReplyClick,
		isMainComment: true && comment.children && comment.children.length > 0,
	})

	commentsListDocEl.appendChild(commentEl)
}

async function onAddComment({ commentContent = '', parentId = '' }) {
	let createdComment

	if (!commentContent) return

	try {
		startLoading('Adding comment...')
		createdComment = await postComment({
			content: commentContent,
			authorId: Math.floor(Math.random() * 3) + 1,
			parentId,
		})
	} catch {
		alert("It's not possible to add a comment at the moment. Try later")
	} finally {
		stopLoading()
	}

	renderCommentInList(createdComment)

	document.getElementById('comment')

	document
		.getElementById('comments-form-container')
		.getElementsByClassName('create-comment-input')[0].value = ''
}

async function onUpvoteComment(comment) {
	try {
		await upvoteComment(comment.id)
	} catch {
		alert("It's not possible to upvote the comment at the moment. Try later")
	}
}

async function onReplyClick(comment) {
	const commentFormContainerEl = document.createElement('div')
	const commentEl = document.getElementById(`comment-${comment.id}`)

	commentEl.querySelector('.vl').style = `${
		commentEl.querySelector('.vl').style
	} display:block`

	const commentFormEl = CommentForm.render({
		onAddComment: async commentContent => {
			await onAddComment({ commentContent, parentId: comment.id })
			commentFormContainerEl.remove()
		},
		style: 'margin-left:50px',
	})

	commentFormContainerEl.appendChild(commentFormEl)

	_insertAfter(commentFormContainerEl, commentEl)
}

function startLoading(loadingMessage = '') {
	loaderEl.innerHTML = loadingMessage
}

function stopLoading() {
	loaderEl.innerHTML = ''
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

function _insertAfter(newNode, existingNode) {
	existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling)
}

onMounted()
