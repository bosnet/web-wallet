import * as types from 'actions/ActionTypes';

const initialState = {
  isShow: false,
  callback: null,
};

function authUser( state = initialState, action ) {
	switch ( action.type ) {
		case types.SHOW_AUTH_USER:
			return {
				...state,
        isShow: action.isShow,
        callback: action.callback,
			};
		default:
			return state;
	}
};

export default authUser;