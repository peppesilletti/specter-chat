import { io } from 'socket.io-client'
import React from 'react'
import ReactDOM from 'react-dom'
import Upvotes from './components/Upvotes'

import { getComments, postComment, upvoteComment } from './api'
import U from './components/utils'

import CommentForm from './components/CommentForm'
import Comment from './components/Comment'
import CommentList from './components/CommentList'

import './style.css'

// Cache
let comments = []

// Elements refs
const commentsListDocEl = document.getElementById('comments-container')
const commentsFormContainerEl = document.getElementById(
	'comments-form-container',
)
const loaderEl = document.getElementById('loader')

function onMounted() {
	const socket = io('http://localhost:3001')

	socket.on('COMMENT_UPVOTED', ({ commentId }) => {
		_increaseCommentUpvotes(commentId)
	})

	render()
}

async function render() {
	// Fetch and render comments list
	startLoading('Fetching comments...')
	try {
		comments = await getComments()
	} catch {
		alert("It's not possible to load the comments at the moment. Try later")
	} finally {
		stopLoading()
	}

	renderForm()
	renderCommentList(comments)
}

function renderCommentList(comments) {
	const commentListEl = CommentList.render({
		comments,
		onAddComment,
		onUpvoteComment,
	})

	commentsListDocEl.childNodes[0].replaceWith(commentListEl)
}

function renderForm() {
	// Render form
	const commentFormEl = CommentForm.render({
		containerElId: '',
		onAddComment: commentContent => onAddComment({ commentContent }),
	})

	commentsFormContainerEl.appendChild(commentFormEl)
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

		comments = [...comments, createdComment]

		if (parentId) {
			const parentIndex = comments.findIndex(comment => comment.id === parentId)
			const newParentChildren = [
				...comments[parentIndex].children,
				createdComment,
			]
			comments[parentIndex] = {
				...comments[parentIndex],
				children: newParentChildren,
			}
		}

		renderCommentList(comments)
	} catch {
		alert("It's not possible to add a comment at the moment. Try later")
	} finally {
		stopLoading()

		commentsFormContainerEl.getElementsByClassName(
			'create-comment-input',
		)[0].value = ''
	}
}

async function onUpvoteComment(comment) {
	try {
		await upvoteComment(comment.id)
	} catch {
		alert("It's not possible to upvote the comment at the moment. Try later")
	}
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

onMounted()
