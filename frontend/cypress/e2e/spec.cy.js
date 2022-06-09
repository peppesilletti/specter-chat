describe('Comments', () => {
	it('should create and upvote a comment correctly', () => {
		cy.visit('http://localhost:3000')
		cy.contains('Discussion')

		const commentContent =
			'Never forget what you are. The rest of the world will not. Wear it like armor, and it can never be used to hurt you.'

		cy.get('[data-testid="create-comment-input"]')
			.type(commentContent)
			.should('have.value', commentContent)

		cy.get('[data-testid="create-comment-button"]').contains('Comment').click()

		cy.get('[data-testid="comments-container"]').contains(commentContent)

		cy.get('[data-testid="comments-container"]').contains('Upvoted 0 times')

		cy.get('[data-testid="upvote-comment"]').click()
		cy.get('[data-testid="upvote-comment"]').click()

		cy.get('[data-testid="comments-container"]').contains('Upvoted 2 times')
	})
})
