// Redux messages reducer
export default function reducer(state={
	messages: []
	}, action){
		switch (action.type){
			case "ADD_MESSAGE": {
				// Array works like a queue FIFO
				// always store last 10 messages
				const messageList = [...state.messages];
				if(messageList.length < 10) {
					return {...state, 
						messages: [...state.messages, action.payload]
					};
				}else{
					// remove first and add to the end new message, when 11th message came
					messageList.shift();
					messageList.push(action.payload);
					return {...state, messages: messageList};
				}
			}
			case "SET_MESSAGES": {
				return {...state, messages: action.payload.messages};
			}
		}

		return state;
}