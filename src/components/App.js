import React from 'react';
import io from 'socket.io-client';
import { connect } from "react-redux";

import ChatContainer from './ChatContainer.js';
import User from '../static/js/User.js';
import * as user from '../actions/userActions.js'
import * as messageHandler from "../actions/messagesActions.js";

// Socket object for server connection
const socket = io.connect();
// Number of registered users
var usersCounter = 0;
// Flag variable for checking whether user esists in list of registered
var userExist = false;
// Array for messages storage
var messages = [];
// Array for registered users storage
var users = [];

// Subscription for the state of active user and list of messages store
@connect((store) => {	
	return {
		activeUser: store.users.activeUser,
		messagesArray: store.messages.messages
	};
})

// Smart component
// Layout of application
export default class App extends React.Component{

	constructor(){
		super();
		this.state = {
			loggedIn: false,
			activeUser: "",
			isloggedOutPressed: false,
			messageList: [],
			usersList: [],
			usersCount: 0
		};

	}

	/*
		Load info from the server after component mount
	*/
	componentDidMount(){
		socket.on('change number of users', this.changeNumberOfUsers.bind(this));

		socket.on('load users', this.loadUsers.bind(this));

  		socket.on('load messages', this.loadMessages.bind(this));
	}


	/*
		Methods for processing cookies
	*/

	// Set active user by info from cookies
	setActiveUser() {
		 var user = this.getCookie("activeUser");
		 if(user === undefined || user === ""){
		 	return "";
		 }else{
		 	return user;
		 }
	}

	// Load users
	loadUsers(usersList) {
		var list = users.concat(usersList.users);
		users = list.filter(this.onlyUnique);
		this.setState({usersList: users});
	}

	onlyUnique(value, index, self) { 
    	return self.indexOf(value) === index;
	}

	// Changer number of users
	changeNumberOfUsers(number) {
		usersCounter = number.number;
    	this.setState({usersCount: usersCounter});
	}

	// Load messages
	loadMessages(messagesList) {
		messages = [...messagesList.messages];
  		this.setState({messageList: messages});
	}

	// Set users list by info from cookies
	setUsersList() {
		var usersList = this.getCookie("registeredList");

		if(usersList === "" || usersList === undefined){
			return "";
		}else {
			return JSON.parse(usersList);
		}
	}

	// Get cookie of the page by name
	getCookie(name) {
		var matches = document.cookie.match(new RegExp(
    	"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  		));
  		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	// Remove cookie from the page by name
	deleteCookie( name ) {
 		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}


	/*
		Handling functions
	*/

	// Handle received message
	messageRecieve (message){

        // Here we are concatenating the new emitted message into our ChatApp's messages list
        messages= [...messages, message];
        this.props.dispatch(messageHandler.addMessage(message));
        this.setState({messageList: messages});

	}

	// Handle login button
	handleLoginButton(e){
		e.preventDefault();

		var name = document.getElementById("login_field").value;
		userExist = false;

		// Check whether user already exist
		if(users.length != 0){
			for (var i = 0; i < users.length; i++) {
			  	if(users[i].user === name){
			  		userExist = true;
			  	}
			}
		}

		// If limited number of users are not registered yet
		// Or login is made by already registered user
		if (users.length <= 3 || userExist === true) {
			if(userExist === false){
				socket.emit('add user', { name: name, isActive: true});
			}

			this.props.dispatch(user.login(name));

    		this.setState({activeUser: name});
    		this.setState({loggedIn: "true"});
    		this.setState({messageList: messages});

    		// Save active user to cookie
    		document.cookie = "activeUser=" + name;
    		// Save list of registered users to cookie
    		document.cookie = "registeredList=" + JSON.stringify(users);

    		this.setState({isloggedOutPressed: false});

    	}else{
    		
    		alert("Sorry the chat has limited number of users!");
    		document.getElementById("login_field").value = "";
    	}

	}

	// Handle log out button
	handleLogoutButton(e){
		e.preventDefault();

		var data = "false";
		this.setState({messageList: messages});
		this.setState({activeUser: ""});
    	this.setState({loggedIn: "false"});
    	// Remove active user from cookie
		this.deleteCookie("activeUser");

		this.setState({isloggedOutPressed: true});
	}

	handleKeyUp(event){
   		event.preventDefault();

   		if (event.keyCode == 13) {
        	document.getElementById("login_button").click();
    	}
	}

	render() {

		var activeUser = this.setActiveUser();

		var header;

		if((this.state.loggedIn === false && activeUser === "") || this.state.isloggedOutPressed === true){

			header = <div className="header"><div className="app_name">Simple Messenger</div><div className="login_form"><input id="login_field" type="text" size="30" placeholder="Enter your name" onKeyUp={this.handleKeyUp.bind(this)} autoComplete="off"/><button id="login_button" className="login_button" onClick={this.handleLoginButton.bind(this)}>Log in</button></div></div>;
		
		}else{

			var name = "";

			if(this.state.activeUser === ""){
				name = activeUser;
			}else{
				name = this.state.activeUser;
			}

			header = <div className="header"><div className="app_name">Simple Messenger</div><div className="login_form"><div id="user_name" className="user_name">{name}</div><button className="logout_button" onClick={this.handleLogoutButton.bind(this)}>Log out</button></div></div>;
		}

		return (
			<div className="wrapper">
				{header}
				<ChatContainer messageList={messages} loggedInState={this.state.loggedIn} userName={activeUser} isLoggedOut={this.state.isloggedOutPressed} onChange={this.messageRecieve.bind(this)}/>
			</div>
		);
	}
}