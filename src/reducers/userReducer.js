// Redux user reducer
export default function reducer(state={
		activeUser: ""
	}, action){
		switch (action.type){
			case "LOGIN": {
				return {...state, activeUser: action.payload.name};
			}
		}

		return state;
}
