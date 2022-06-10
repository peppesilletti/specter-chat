function insertAfter(newNode, existingNode) {
	existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling)
}

function insertBefore(newNode, existingNode) {
	existingNode.parentNode.insertBefore(newNode, existingNode)
}

export default { insertAfter, insertBefore }
