import * as types from 'actions/ActionTypes';
import { find } from 'underscore';

const initialState = {
	list: [],
	account: null,
	effects: null,
	offers: null,
	payment: null,
  paymentHistory: [],
  operationHistory: {},
};

function stream( state = initialState, action ) {
	switch ( action.type ) {
		case types.STREAM_ACCOUNT:
			return {
				...state,
				account: action.account,
			};
		case types.STREAM_EFFECTS:
			return {
				...state,
				effects: action.effects,
			};
		case types.STREAM_OFFERS:
			return {
				...state,
				offers: action.offers,
			};
		case types.STREAM_PAYMENT:
			const exist = find( state.paymentHistory, $item => $item.id === action.payment.id );
			let returnState = {
				...state,
			};
			if ( !exist ) {
        let paymentHistory = [ ...action.payment, ...state.paymentHistory ];

				returnState = {
					...state,
					payment: action.payment,
					paymentHistory,
				}
			}
      return returnState;
    case types.STREAM_OPERATIONS: 
      let paymentHistory = [...state.paymentHistory ];
      paymentHistory[action.index] = {
        ...paymentHistory[action.index],
        ...action.operations,
      }

      return {
        ...state,
        paymentHistory,
      };
		case types.RESET_HISTORY :
			return {
				...state,
				paymentHistory: [],
			};
		default:
			return state;
	}
}

export default stream;