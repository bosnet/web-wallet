import * as types from 'actions/ActionTypes';

const initialState = {
	isShow: false,
	redirect: true,
};

function recordSeed( state = initialState, action ) {
	switch ( action.type ) {
		case types.SHOW_RECORD_SEED:
			return {
				...state,
				isShow: action.isShow,
			};
		case types.RECORD_SEED_REDIRECT:
			return {
				...state,
				redirect: action.redirect,
			}
		default:
			return state;
	}
}

export default recordSeed;