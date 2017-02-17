// Actions to handle by Redux messages reducer
export function addMessage(message){
	return{
		type: "ADD_MESSAGE",
		payload: message
	};
}

export function setMessages(messageList){
	return{
		type: "SET_MESSAGES",
		payload: messages
	};
}