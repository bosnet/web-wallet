import language from './language';
import keypair from './keypair';
import spinner from './spinner';
import keyGenerator from './keyGenerator';
import setPassword from './setPassword';
import authUser from './authUser';
import generatorConfirm from './generatorConfirm';
import recordSeed from './recordSeed';
import copyComplete from './copyComplete';
import transactionConfirm from './transactionConfirm';
import transactionComplete from './transactionComplete';
import stream from './stream';
import maintenance from './maintenance';
import timer from './timer';

import { combineReducers } from 'redux';

const reducers = combineReducers( {
	language,
	keypair,
	spinner,
	keyGenerator,
	setPassword,
	authUser,
	generatorConfirm,
	recordSeed,
	copyComplete,
	transactionConfirm,
	transactionComplete,
	stream,
	maintenance,
	timer,
} );

export default reducers;