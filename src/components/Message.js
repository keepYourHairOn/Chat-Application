import React from 'react';

//Dumb component

// Component to form a message
export default class Message extends React.Component {

	// Add prefix to the input field with the recipient
	// on click for the receiver or recipient of the message
    userNameClickHandler(value, e){
    	if((document.getElementById("chat_input_field").disabled === false) && (document.getElementById("user_name").innerHTML != value) 
    		&& (document.getElementById("chat_input_field").value.includes("@") === false)){

    		document.getElementById("chat_input_field").value = "@" + value + ","+ document.getElementById("chat_input_field").value;
    	}
    }

	render() {
		var messageItem = this.props.messageItem;

		var toUser;
		let boundFromClick = this.userNameClickHandler.bind(this, messageItem.user);

		if(messageItem.to != ""){
			let boundToClick = this.userNameClickHandler.bind(this, messageItem.to);
	        toUser = <span>@<span id="to_user" onClick={boundToClick}>{messageItem.to}</span></span>;
	    }

        return (
            <div className="message" ref="message">
                <span id='user' onClick={boundFromClick}><b>{messageItem.user}</b></span>
                <span id='text_with_recipient'>
	            	{toUser}
                	<span className='message_text'> {messageItem.msg}</span>
                </span>
			</div>
        );
	}
}