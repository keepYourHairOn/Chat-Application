import React from 'react';

import Message from './Message.js';

//Dumb component
var messages;
// Component for messages outputing
export default class MessageContainer extends React.Component {
	constructor(){
		super();
	}

	render() {

		// Build a map of messages
		messages = this.props.messages.map(function(messageItem) {
			return <Message messageItem={messageItem} key={messageItem.time + messageItem.to}/>;
        });

		return(
			<div className="message_container">
				<div className="message_list" ref="message_list">
					{messages}
				</div>
			</div>
		);
	}
}