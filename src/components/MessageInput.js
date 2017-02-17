import React from 'react';
import io from 'socket.io-client';

import Message from '../static/js/Message.js';

//Dumb components
// Socket object for server connection
const socket = io();
// Component for message input and its handling 
export default class MessageInput extends React.Component{
	constructor(){
		super();
	}

	// On message sending pass it to the callback function and send to the server
	handleSendMessage(e) {
    	e.preventDefault();

    	// Read message from input field
        var msgText = document.getElementById("chat_input_field").value;
        // Errase message from the input field
        document.getElementById("chat_input_field").value = "";
        
        if (msgText.value === '') {
            return;
        }

        // Date and time of the message's sending
        var d = new Date();
        var date = ((d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear() +
                    ' ' + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()).toString();

        var toUser = "";
        // Exclude recipient of the message from it's text
        if(msgText.includes("@") === true){
			var splitedMsg = msgText.split(',',1);
			toUser = splitedMsg[0];
			msgText = msgText.replace(splitedMsg[0],"");
			toUser = toUser.replace('@','');
		}

        var message = new Message(this.props.user, toUser, msgText, date);

        // Pass message to the callback function
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(message);
        }

        // Send message to the server
        socket.emit('receive message', message);
    }

    // Send a message on "Enter" press
	handleKeyUp(event){
   		event.preventDefault();

   		if (event.keyCode == 13) {
        	document.getElementById("send_msg_button").click();
    	}
	}

	render() {

		if((this.props.loggedIn === false && this.props.user === "") || this.props.isLoggedOut === true){
			return (
				<div className="message_input_container">
					<input className='message_input' id="chat_input_field" type='text' maxLength={400} placeholder='Enter a message' ref='msg' disabled/>
					<button className="send_msg_button" disabled>Send</button>
				</div>
			);
		}else{
			return(
				<div className="message_input_container">
					<input className='message_input' id="chat_input_field" type='text' maxLength={400} placeholder='Enter a message' onKeyUp={this.handleKeyUp.bind(this)} ref='msg'/>
					<button className="send_msg_button" id="send_msg_button" onClick={this.handleSendMessage.bind(this)}>Send</button>
				</div>
			);
		}		
	}
}