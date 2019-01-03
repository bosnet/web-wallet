import React, { Component } from 'react';
import BlueButton from './BlueButton';
import { connect } from "react-redux";
import * as actions from "actions/index";
import './PasswordForm.scss';
import T from 'i18n-react';
import { StellarTools } from 'libs/stellar-toolkit';
import TextAlert from "./TextAlert";
import { Keypair } from 'libs/stellar-sdk';
import { encryptWallet } from 'libs/keyCipher';

class PasswordForm extends Component {
	constructor() {
		super();

		const state = {
			error: null,
		};

		this.state = state;
	}


	onChange = () => {

	};

	componentDidMount() {
		this.timer = setInterval( () => {
			this.onChange();
		}, 50 );
	}

	componentWillUnmount() {
		clearInterval( this.timer );
	}

	validate = (text) => {
		// const regex = /^([a-zA-Z0-9~!@#$%^&*()-_]){8,16}$/;
		// const match = text.match(regex);
	
		// 공백, 사용 불가문자 확인
		if (text.match(/[\n\r\t ]/) || text.match(/[^a-zA-Z0-9~!@#$%^&*()_-]/)) {
			return false;
		}
	
		// 길이 확인
		if (text.length < 8) {
			return false;
		}
	
		// 소문자 유무
		if (!text.match(/[a-z]/)) {
			return false;
		}
	
		// 대문자 유무
		if (!text.match(/[A-Z]/)) {
			return false;
		}
	
		// 숫자 유무
		if (!text.match(/[0-9]/)) {
			return false;
		}
	
		// 특수문자 유무
		if (!text.match(/[!@#$%^&*()_-]/)) {
			return false;
		}
	
		return true;
	};

	renderError = () => {
		if ( this.state.error ) {
			return <TextAlert>{T.translate( this.state.error, { minimum_balance: process.env.MINIMUM_BALANCE } )}</TextAlert>;
		}
		else {
			return '';
		}
	};

	doClose = () => {
		this.props.doClose();
	};

	nextStep = () => {
		const password = document.querySelector(".input-password").value;
		const passwordConfirm = document.querySelector(".input-password.confirm").value;

		if (password.length === 0 || passwordConfirm.length === 0) {
			this.setState({
				error: "error_message.no_password",
			})
			return false;
		}

		if (password !== passwordConfirm) {
			this.setState({
				error: "error_message.password_not_match",
			})
			return false;
		}

		if (!this.validate(password)) {
			this.setState({
				error: "error_message.invalid_password",
			})
			return false;
		}
		
		this.setState( { error: null } );

		const keyPair = this.props.keypair;
		const resKey = encryptWallet(password, keyPair.secret());
		if (resKey) {
			this.props.updateKeypair( keyPair, resKey );
			this.props.callback();	
		} else {
			this.setState({
				error: "error_popup.main_message",
			})
			return false;
		}
	};

	render() {
		return (
			<div className="passowrd-form-container">
				<div className="input-group">
					<input type="hidden" value="something"/>
					<div className="input-group-label-wrapper">
						<p className="input-label only-mobile">
							{T.translate("set_password.input_password")}
						</p>
						<p className="input-label gt-md">
							{T.translate("set_password.input_password")}
						</p>
						<input className="input-password" type="password" autoComplete="off" placeholder={T.translate("login_view.recovery_key.pw_password")} />
					</div>

					<div className="input-group-label-wrapper">
						<p className="input-label only-mobile">
							{T.translate("set_password.input_password_confirm")}
						</p> <br/>
						<p className="input-label gt-md">
							{T.translate("set_password.input_password_confirm")}
						</p>
						<input className="input-password confirm" type="password" autoComplete="off" placeholder={T.translate("login_view.recovery_key.pw_password")} />
					</div>
				</div>
				<div>
					{this.renderError()}
					<div className="button-wrapper">
							<BlueButton medium onClick={this.nextStep}>{T.translate( 'set_password.button_set' )}</BlueButton>
							<BlueButton medium onClick={this.doClose}>{T.translate( 'common.cancel' )}</BlueButton>
					</div>
				</div>

			</div>
		)
	}
}

const mapDispatchToProps = ( dispatch ) => ({
	showTransactionConfirm: ( $isShow, $paymentData ) => {
		dispatch( actions.showTransactionConfirm( $isShow, $paymentData ) );
	},
	showSetPassword: ( $isShow ) => {
		dispatch( actions.showSetPassword( $isShow ) );
	},
	showKeyGenerator: ( $isShow ) => {
		dispatch( actions.showKeyGenerator( $isShow ) );
	},
	updateKeypair: ( $keypair, $resKey ) => {
		dispatch( actions.updateKeypair( $keypair, $resKey ) );
	},
});

const mapStoreToProps = ( store ) => ({
	keypair: store.keypair.keypair,
	language: store.language.language,
	account: store.stream.account,
	showTransactionComplete: store.transactionComplete.isShow,
});

PasswordForm = connect( mapStoreToProps, mapDispatchToProps )( PasswordForm );

export default PasswordForm;