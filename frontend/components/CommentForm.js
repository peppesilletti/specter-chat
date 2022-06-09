function render({ onAddComment, style = '' }) {
	const commentFormEl = document.createElement('div')

	const formHTML = `
		<div class="comments-form" style=${style}>
			<div class="avatar-container">
				<img src="https://gravatar.com/avatar/aed45db8f8c47da256ece14e137de715?s=400&d=robohash&r=x" alt="Avatar" class="avatar">
			</div>

			<div class="create-comment-input-container">
				<input
					data-testid="create-comment-input"
					class="create-comment-input"
					type="text"
					placeholder="What are your thoughts?"
				/>
			</div>

			<div class="create-comment-button-container">
				<button data-testid="create-comment-button" class="create-comment-button" type="button">Comment</button>
			</div>
		</div>
	`

	commentFormEl.innerHTML = formHTML

	const createCommentInputEl = commentFormEl.getElementsByClassName(
		'create-comment-input',
	)[0]
	const createCommentButtonEl = commentFormEl.getElementsByClassName(
		'create-comment-button',
	)[0]

	createCommentButtonEl.addEventListener(
		'click',
		() => onAddComment(createCommentInputEl.value),
		false,
	)
	createCommentInputEl.addEventListener(
		'keydown',
		e => {
			if (e.key == 'Enter') {
				onAddComment(createCommentInputEl.value)
			}
		},
		false,
	)

	return commentFormEl
}

export default { render }
