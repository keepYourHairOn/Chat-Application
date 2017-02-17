// Keep track of which names are used so that there are no duplicates
var userNames = (function () {
  var names = {};

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  // find the lowest unused "guest" name and claim it
  var getGuestName = function () {
    var name,
      nextUserId = 1;

    do {
      name = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  // serialize claimed names as an array
  var get = function () {
    var res = [];
    for (user in names) {
      res.push(user);
    }

    return res;
  };

  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());

// export function for listening to the socket
module.exports = function (socket) {
  var name = userNames.getGuestName();

  // send the new user their name and a list of users
  socket.emit('init', {
    name: name,
    users: userNames.get()
  });

  // notify other clients that a new user has joined
  socket.broadcast.emit('user:join', {
    name: name
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', {
      user: name,
      text: data.text
    });
  });

  // validate a user's name change, and broadcast it on success
  socket.on('change:name', function (data, fn) {
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);

      name = data.name;
      
      socket.broadcast.emit('change:name', {
        oldName: oldName,
        newName: name
      });

      fn(true);
    } else {
      fn(false);
    }
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
      name: name
    });
    userNames.free(name);
  });
};


/*
  socket.on('change number of users', this.changeNumberOfUsers.bind(this));

    socket.on('load users', this.loadUsers.bind(this));

      socket.on('load messages', this.loadMessages.bind(this));

      socket.on('receive message', this.messageRecieve.bind(this));
      socket.on('add user', this.addUser.bind(this));

*/

/*

    socket.emit('change number of users', { number: usersCount });

  //socket.emit('change active user', {activeUser: activeUser});

  // new user handler
  socket.on('add user', function (data) {
    existedUserLogin = false;

    if(users.length != 0){
      for (var i = 0; i < users.length; i++) {
          if(users[i].user === data.name){
            existedUserLogin = true;
          }
        }
    }

    // limit max number of users to 3
      if (usersCount < 3) {

        if(existedUserLogin === false){
          users[usersCount] = new User(data.name, data.isActive);
          usersCount++;
        }

        socket.emit('change number of users', { number: usersCount});
        socket.broadcast.emit('load users', {users: users});
        socket.broadcast.emit('add user', {name: data.name}

      }

  });

  socket.emit('load users', {users: users});

  socket.emit('load messages', {messages: messagesQueue});

  socket.on('receive message', function (data) {
    var msg = data;

    messagesQueue.push(msg);

    if(messagesQueue.length > 10){
      messagesQueue.shift();
    }

    socket.emit('load messages', {messages: messagesQueue});
    socket.broadcast.emit('load messages', {messages: messagesQueue});
    socket.broadcast.emit('receive message', {message: msg});
  });

  */