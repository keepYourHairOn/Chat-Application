// User class to store user's info
function User (userName, loginStatus) {
	this.user = userName;
	this.isActive = loginStatus
}

User.prototype.setIsActive = function(loginStatus) {
	this.isActive = loginStatus;
};

module.exports = User;