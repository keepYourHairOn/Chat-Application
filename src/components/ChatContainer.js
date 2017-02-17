import React from 'react';

import MessageInput from './MessageInput.js';
import MessageContainer from './MessageContainer.js';

//Dumb component

// Component for message outlining and message input
export default class ChatContainer extends React.Component {

	// On message sending pass it to the callback function
	messageInputHandler(message) {
		if (typeof this.props.onChange === 'function') {
            this.props.onChange(message);
        }
	}

	render() {
		return (
			<div className="chat_container">
				<span className="chat_name">Chat for everyone</span>
				<MessageContainer messages={this.props.messageList} />
				<MessageInput loggedIn={this.props.loggedInState} user={this.props.userName} isLoggedOut={this.props.isLoggedOut} onChange={this.messageInputHandler.bind(this)}/>
			</div>
		);
	}
}