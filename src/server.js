// Server with connection to the react components
// and sockets for real time rendering

import path from 'path';
import { Server } from 'http';
import Express from 'express';
import { renderToString } from 'react-dom/server';

import User from './static/js/User.js';

// Initialize the server and configure support for ejs templates
const app = require('express')();
const server = require('http').Server(app);
const cookieParser = require('cookie-parser');
var io = require('socket.io')(server);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());

// Define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, 'static')));

var cookieDeleted = false;
app.get('/', function (req, res) {
  if(cookieDeleted === false){
  		res.clearCookie('activerUser');
  		cookieDeleted = true;
	}
	res.render('index');
});

// Store users during the session
// In further could be changed to db
var users = [];
// Number of registered users
var usersCount = 0;
// Store messages during the session
// In further could be changed to db
var messagesQueue = [];

// Flag to determine wheather existed user tries to login
var existedUserLogin = false;

// Socket.io connection handler
io.on('connection', function (socket) {
	socket.emit('change number of users', { number: usersCount });

	socket.emit('load users', {users: users});

	// New user handler
	socket.on('add user', function (data) {
		existedUserLogin = false;

		if(users.length != 0){
			for (var i = 0; i < users.length; i++) {
		  		if(users[i].user === data.name){
		  			existedUserLogin = true;
		  		}
		  	}
		}

		// Limit max number of users to 3
	  	if (usersCount < 3 && existedUserLogin === false) {
	  		users[usersCount] = new User(data.name, data.isActive);
	  		usersCount++;
	  	}

	  	socket.emit('load users', {users: users});

	  	// Notify all other connected to the server users
	  	socket.broadcast.emit('load users', {users: users});

	});

	socket.emit('load messages', {messages: messagesQueue});

	socket.on('receive message', function (data) {
		var msg = data;

		messagesQueue.push(msg);

		if(messagesQueue.length > 10){
			messagesQueue.shift();
		}

		// Send message to all other connected to the server users
		socket.broadcast.emit('load messages', {messages: messagesQueue});
	});
});


// Start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});

module.exports = app;