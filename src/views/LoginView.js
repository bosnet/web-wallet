import React, { Component } from 'react';
import BlueButton from 'components/BlueButton';
import './LoginView.scss';
import { Redirect } from "react-router-dom";
import { StellarTools } from 'libs/stellar-toolkit';
import * as actions from "actions/index";
import { connect } from "react-redux";
import T from 'i18n-react';
import StreamManager from "../StreamManager";
import pageview from 'utils/pageview';
import store from '../observables/store';
import BigNumber from "bignumber.js";
import SecretSeedForm from '../components/SecretSeedForm';
import RecoveryKeyForm from '../components/RecoveryKeyForm';

const MODE_SECRET_KEY = '0';
const MODE_RECOVERY_KEY = '1';

class LoginView extends Component {
	constructor() {
		super();

		this.state = {
			redirect: null,
			isValid: null,
			mode: MODE_SECRET_KEY,
		};

		this.onChange = this.onChange.bind(this);
		this.renderForm = this.renderForm.bind(this);
	}

	onChange() {
		console.log("CHANGE");
		const radio = document.querySelector("input[type=radio]:checked").value;
		// const value = document.querySelector('#radio').value;
		this.setState({
			mode: radio
		})
	}

	renderForm() {
		const { mode } = this.state;
		switch (mode) {
			case MODE_SECRET_KEY: 
				return	<SecretSeedForm />;
			case MODE_RECOVERY_KEY:
				return	<RecoveryKeyForm />;
			default:
				return	<SecretSeedForm />;
		}
	}

	render() {
		const style = {
			border: '1px solid #039cbf',
		};
		if ( this.state.isValid === false ) {
			style.border = '1px solid #f40b21';
		}
		return (
			<div className="login-container">
				<div className="content-container">
					<div className="content-middle-wrapper">
						<div className="content-wrapper">
							<div>
								<h1>
									<T.span text="login_view.header"/>
								</h1>
								<span className="under-line-blue"> </span>
								<div className="radio_box">
									<label className="radio_container">{T.translate("login_view.use_secret_seed")}
										<input type="radio"
											id="radio_ss"
											name="radio"
											onChange={ this.onChange }
											value={MODE_SECRET_KEY}
										/>
										<span className="radiomark"></span>
									</label>
									<label className="radio_container">{T.translate("login_view.use_recovery_key")}
										<input type="radio"
											id="radio_rk"
											name="radio"
											onChange={ this.onChange }
											value={MODE_RECOVERY_KEY}
										/>
										<span className="radiomark"></span>
									</label>
								</div>
								{this.renderForm()}
							</div>
						</div>
					</div>
				</div>

			</div>
		)
	}

	componentDidMount() {
		pageview();

		document.querySelector("#radio_ss").checked = true;
	}
}

const mapStoreToProps = ( store ) => ({
	keypair: store.keypair.keypair,
});

// Redux
const mapDispatchToStore = ( dispatch ) => ( {
	streamAccount: ( $account ) => {
		dispatch( actions.streamAccount( $account ) );
	},
	streamEffects: ( $effects ) => {
		dispatch( actions.streamEffects( $effects ) );
	},
	streamOffers: ( $offers ) => {
		dispatch( actions.streamOffers( $offers ) );
	},
	streamPayment: ( $payment ) => {
		dispatch( actions.streamPayment( $payment ) );
	},
	updateKeypair: ( $keypair ) => {
		dispatch( actions.updateKeypair( $keypair ) );
  },
	resetHistory: () => {
		dispatch( actions.resetHistory() );
	},
	showTimer: ( isShow ) => {
		dispatch( actions.showTimer( isShow ) );
	}
} );

LoginView = connect( mapStoreToProps, mapDispatchToStore )( LoginView );

export default LoginView;