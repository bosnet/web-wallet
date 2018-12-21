import React, { Component } from 'react';
import ModalContainer from './ModalContainer';
import BlueButton from 'components/BlueButton';
import KeyGeneratorMessage from './KeyGeneratorMessage';
import ConfirmCheckboxes from './ConfirmCheckboxes';
import './AuthUser.scss';
import * as actions from "actions/index";
import { connect } from "react-redux";
import T from 'i18n-react';
import { Keypair } from 'libs/stellar-sdk';
import pageview from "utils/pageview";
import { encryptWallet, decryptWallet } from 'libs/keyCipher';
import TextAlert from '../components/TextAlert';

const config = require( 'config.json' );

class AuthUser extends Component {
	constructor() {
		super();

		const state = {
			error: null,
		};

    this.state = state;
  }

  doAuth = () => {
    const password = document.querySelector(".input-auth-password").value;

    if (password.length === 0) {
      this.setState({
        error: "error_message.no_password"
      })
      return;
    }
 
		const value = decryptWallet(password, this.props.resKey);
    if (!value) {
			this.setState({
        error: "error_message.invalid_password"
			});
    } else {
			this.props.callback();
      this.props.showAuthUser(false);
    }
  }

  doClose = () => {
    this.props.showAuthUser(false);
  }

  renderError = () => {
		if ( this.state.error ) {
			return <TextAlert>{T.translate( this.state.error, { minimum_balance: config.minimum_balance } )}</TextAlert>;
		}
		else {
			return '';
		}
	};

	render() {
		return (
			<ModalContainer doClose={this.doClose} modalOpen={this.props.modalOpen}>
				<div className="auth-user-container">
					<div>
						<h1 className="warn-header">{T.translate( 'auth_user.header' )}</h1>
						<span className="under-line"> </span>
					</div> 
          <div className="input-group">
						<input type="hidden" value="something"/>
            <div className="input-group-label-wrapper">
              <p className="input-label only-mobile">
								{T.translate("auth_user.input_password")}
              </p>
              <p className="input-label gt-md">
								{T.translate("auth_user.input_password")}
              </p>
              <input className="input-auth-password" type="password" autoComplete="off" />
            </div>
          </div>
          {this.renderError()}
          <p className="button-wrapper">
						<BlueButton medium
									onClick={this.doAuth}>{T.translate( 'common.ok' )}</BlueButton>
						<BlueButton medium onClick={this.doClose}>{T.translate( 'common.cancel' )}</BlueButton>
					</p>
				</div>
			</ModalContainer>
		)
	}

	componentDidMount() {
		pageview( '/popup/confirm-generator-open' );
	}
}

const mapStoreToProps = ( store ) => ({
  keypair: store.keypair.keypair,
	resKey: store.keypair.resKey,
	callback: store.authUser.callback,
});

// Redux
const mapDispatchToProps = ( dispatch ) => ({
	showSpinner: ( $isShow ) => {
		dispatch( actions.showSpinner( $isShow ) );
	},
	showKeyGenerator: ( $isShow ) => {
		dispatch( actions.showKeyGenerator( $isShow ) );
	},
	showGeneratorConfirm: ( $isShow ) => {
		dispatch( actions.showGeneratorConfirm( $isShow ) );
	},
	showSetPassword: ( $isShow ) => {
		dispatch( actions.showSetPassword( $isShow) );
  },
  showAuthUser: ( $isShow, $callback ) => {
		dispatch( actions.showAuthUser( $isShow, $callback ) );
	},
	updateKeypair: ( $keypair ) => {
		dispatch( actions.updateKeypair( $keypair ) );
	},
});

AuthUser = connect( mapStoreToProps, mapDispatchToProps )( AuthUser );

export default AuthUser;