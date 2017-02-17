// Message class to store message's info
function Message (userName, toUser, text, date) {
	this.user = userName;
	this.to = toUser;
	this.msg = text;
	this.time = date;
}

Message.prototype.setTo = function(toUser) {
	this.to = toUser;
};

module.exports = Message;