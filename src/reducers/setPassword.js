import * as types from 'actions/ActionTypes';

const initialState = {
	isShow: false,
};

function setPassword( state = initialState, action ) {
	switch ( action.type ) {
		case types.SHOW_SET_PASSWORD:
			return {
				...state,
				isShow: action.isShow,
			};
		default:
			return state;
	}
};

export default setPassword;