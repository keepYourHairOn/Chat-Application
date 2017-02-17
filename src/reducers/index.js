// Redux factory of custom reducers
import {combineReducers} from 'redux';

import messages from "./messagesReducer.js";
import users from "./userReducer.js";

export default combineReducers({
	messages,
	users
});