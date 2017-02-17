// Actions to handle by Redux user reducer
export function login(userName){
	return {
		type: "LOGIN",
		payload: {
			name: userName,
		}
	};
}