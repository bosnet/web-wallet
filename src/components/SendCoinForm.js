import React, { Component } from 'react';
import BlueButton from './BlueButton';
import { connect } from "react-redux";
import * as actions from "actions/index";
import './SendCoinForm.scss';
import T from 'i18n-react';
import { Redirect } from "react-router-dom";
import { StellarTools } from 'libs/stellar-toolkit';
import TextAlert from "./TextAlert";
import AmountInput from "./AmountInput";
import Decimal from 'decimal.js';
import BigNumber from "bignumber.js";

const config = require( 'config.json' );

class SendCoinForm extends Component {
	constructor() {
		super();

		const state = {
			sendingAmount: null,
			transactionFee: config.transaction_fee,
			transactionTotal: config.transaction_fee,
			addressValidated: false,
			publicKey: null,
			error: null,
		};

		this.state = state;
	}

	checkPublicKey = ( $event ) => {
		const key = $event.currentTarget.value.trim();

		// Can not send own public key
		if ( this.props.keypair.publicKey() === key ) {
			this.setState( { addressValidated: false } );
			return false;
		}

		StellarTools.resolveAddress( key )
			.then( ( resolved ) => {
				this.setState( { publicKey: key, addressValidated: true } );
			} )
			.catch( () => {
				this.setState( { publicKey: null, addressValidated: false } );
			} );
	};

	onChange = () => {
    const input = document.querySelector( '.input-sending-amount' );
    let value = input.value ? input.value : 0;

		const sendingAmount = new BigNumber( value );
		const transactionTotal = sendingAmount.plus( this.state.transactionFee ).toString();
		this.setState( {
			sendingAmount,
			transactionTotal,
		} );
	};

	componentDidMount() {
		this.timer = setInterval( () => {
			this.onChange();
		}, 50 );
	}

	componentWillUnmount() {
		clearInterval( this.timer );
	}

	openTransactionConfirm = () => {
		if ( !this.state.publicKey ) {
			this.setState( { error: "send_coin.error.public_address_null" } );
			return false;
		}
		if ( !this.state.addressValidated ) {
			this.setState( { error: "send_coin.error.incorrect_public_address" } );
			return false;
		}
		if ( this.state.sendingAmount === null || this.state.sendingAmount <= 0 ) {
			this.setState( { error: "send_coin.error.transaction_amount_null" } );
			return false;
		}
		const balance = new BigNumber( this.props.account.balance ).toFixed(7).replace(/[0]+$/, '').replace(/[.]+$/, '');

		if ( new BigNumber(this.state.transactionTotal).gt(balance) ) {
			this.setState( { error: "send_coin.error.not_enough_balance" } );
			return false;
		}
		// if ( balance - this.state.transactionTotal < config.minimum_balance ) {
		// 	this.setState( { error: "send_coin.error.minimum_balance" } );
		// 	return false;
		// }
		const numbers = this.state.transactionTotal.toString().split( '.' );
		if( numbers.length > 1 ) {
			if( numbers[ 1 ].length > 7 ) {
				this.setState( { error: "send_coin.error.decimal_limit" } );
				return false;
			}
		}

		this.setState( { error: null } );

		const paymentData = {};
		paymentData.memo = { type: 'none' };
		paymentData.asset = { code: 'XLM', uuid: 'native', shortName: 'XLM', asset_type: 'native' };
		paymentData.destination = this.state.publicKey;
		paymentData.amount = new BigNumber(this.state.sendingAmount).toString();
		paymentData.transactionFee = this.state.transactionFee;
		paymentData.transactionTotal = new BigNumber( this.state.sendingAmount ).plus( this.state.transactionFee );

		this.props.showTransactionConfirm( true, paymentData );

		document.querySelector( '.input-public-address' ).value = '';
		document.querySelector( '.input-sending-amount' ).value = '';
		this.setState( {
			publicKey: null,
			sendingAmount: null,
			addressValidated: false,
		} );
	};

	renderRedirect() {
		if ( this.props.keypair === null ) {
			return <Redirect to={'/'}/>;
		}
		else {
			return '';
		}
	}

	renderError = () => {
		if ( this.state.error ) {
			return <TextAlert>{T.translate( this.state.error, { minimum_balance: config.minimum_balance, unit: process.env.UNIT } )}</TextAlert>;
		}
		else {
			return '';
		}
	};

	render() {
		return (
			<div className="send-coin-form-container">
				{this.renderRedirect()}

				<div className="input-group">
					<div className="input-group-label-wrapper">
						<p className="input-label only-mobile">
							{T.translate( 'send_coin.input_recipient_address' )}
						</p>
						<p className="transaction-fee">
							{T.translate( 'send_coin.transaction_fee' )}: <span>{this.state.transactionFee} { process.env.UNIT }</span>
						</p>

						<p className="input-label gt-md">
							{T.translate( 'send_coin.input_recipient_address' )}
						</p>
						<input className="input-public-address" type="text" onChange={this.checkPublicKey}/>
						<span className={
							'public-address-validation ' +
							(this.state.addressValidated ? 'validated' : '')
						}> </span>
					</div>
				</div>

				<div className="input-group">
					<div className="input-group-label-wrapper">
						<p className="input-label only-mobile">
							{T.translate( 'send_coin.input_amount' )}
						</p> <br/>
						<p className="input-label gt-md">
							{T.translate( 'send_coin.input_amount' )}
						</p>
						<AmountInput className={'input-sending-amount'}
									 onChange={ this.onChange }
						/>
						<p className="sending-amount">
							{T.translate( 'send_coin.total_will_be_sent', {
								amount: new BigNumber(this.state.transactionTotal).toFormat(7).replace(/[0]+$/, '').replace(/[.]+$/, ''),
								unit: process.env.UNIT
							} )}
						</p>
					</div>
				</div>

				<div className="button-wrapper">
					{this.renderError()}
					<BlueButton onClick={this.openTransactionConfirm} medium>{T.translate( 'common.send' )}</BlueButton>
				</div>
			</div>
		)
	}
}

const mapDispatchToProps = ( dispatch ) => ({
	showTransactionConfirm: ( $isShow, $paymentData ) => {
		dispatch( actions.showTransactionConfirm( $isShow, $paymentData ) );
	}
});

const mapStoreToProps = ( store ) => ({
	keypair: store.keypair.keypair,
	language: store.language.language,
	account: store.stream.account,
	showTransactionComplete: store.transactionComplete.isShow,
});

SendCoinForm = connect( mapStoreToProps, mapDispatchToProps )( SendCoinForm );

export default SendCoinForm;