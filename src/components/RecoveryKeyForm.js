import React, { Component } from 'react';
import './RecoveryKeyForm.scss';
import { Redirect } from "react-router-dom";
import T from 'i18n-react';
import BlueButton from 'components/BlueButton';
import StreamManager from "../StreamManager";
import { StellarTools } from 'libs/stellar-toolkit';
import store from '../observables/store';
import BigNumber from "bignumber.js";
import { connect } from "react-redux";
import * as actions from "actions/index";
import { decryptWallet } from "libs/keyCipher";

class RecoveryKeyForm extends Component {
	constructor() {
		super();

		this.state = {
			redirect: null,
			isValid: null,
			error: null,
			btnActive: false,
		};

		this.onChange = this.onChange.bind(this);
		this.openWallet = this.openWallet.bind(this);
	}

	openWallet = () => {
		this.props.showTimer( true );
		this.setState( { redirect: '/wallet' } );
	};

	requestAccount = ( keypair, resKey ) => {
    return fetch(`${process.env.API_URL}/api/v1/accounts/${keypair.publicKey()}`, {
      method: 'GET',
      timeout: 3000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      return res.json()
    })
    .then(account => {
      if( this.props.keypair ) {
        if( this.props.keypair.publicKey() !== keypair.publicKey() ) {
          StreamManager.stopAllStream();
          this.props.resetHistory();

          // Confirm Account Valid
          if(account.status) {
            this.props.updateKeypair( null );
            this.setState( {
							isValid: false,
							error: T.translate("login_view.error.invalid_account"),
						} );
    
            return false;
          }
    
          if(account.balance && account.balance === 0) {
            this.props.updateKeypair( null );
            this.setState( {
							isValid: false,
							error: T.translate("login_view.error.invalid_account"),
						} );
    
            return false;
          }
    
          account.balance = new BigNumber(account.balance).div(10000000).toString();
          this.props.streamAccount(account);
          this.props.updateKeypair(keypair, resKey);
          store.keypair = keypair;

					this.setState({
						isValid: true,
						error: null,
					});     
        }
      }
      else {
        StreamManager.stopAllStream();
				this.props.resetHistory();
				
        // Confirm Account Valid
        if(account.status) {
          this.props.updateKeypair( null );
					this.setState( {
						isValid: false,
						error: T.translate("login_view.error.invalid_account"),
					} );
  
          return false;
        }
  
        if(account.balance && account.balance === 0) {
          this.props.updateKeypair( null );
					this.setState( {
						isValid: false,
						error: T.translate("login_view.error.invalid_account"),
					} );
  
          return false;
        }
  
        account.balance = new BigNumber(account.balance).div(10000000).toString();
        this.props.streamAccount(account);
        this.props.updateKeypair(keypair, resKey);
        store.keypair = keypair;
        this.setState({
					isValid: true,
					error: null,
				});
      }

      this.props.updateKeypair( keypair, resKey );
			store.keypair = keypair;
			store.resKey = resKey;

			this.setState({
				isValid: true,
				error: null,
			});
    })
    .catch( error => {
      this.props.updateKeypair( null );
      this.setState( { isValid: false } );
    });
    
	};

	validateSeed = () => {
		const resKey = document.querySelector('.input-restore-key').value.trim();
		const password = document.querySelector('.input-password').value;

		const value = decryptWallet(password, resKey);
		if (!value) {
			this.setState( {
				isValid: false,
				error: T.translate("error_message.invalid_restorekey"),
			});
			return;
		}

		const isValid = StellarTools.validSeed( value );
		if ( isValid ) {
			const keypair = StellarTools.KeypairInstance( { secretSeed: value } );

			if( this.props.keypair ) {
				if( this.props.keypair.publicKey() !== keypair.publicKey() ) {
					this.requestAccount( keypair, resKey )
						.then(() => {
							if(this.state.isValid) this.openWallet();
						})

				}
				else {
					this.setState( { isValid: true } );
					this.openWallet();
				}
			}
			else {
				this.requestAccount( keypair, resKey )
					.then(() => {	
						if(this.state.isValid) this.openWallet();
					})

			}
		}
		else {
			this.setState({
				isValid: false,
				error: "login_view.error.invalid_secret_seed",
			});
		}
	};
	
	onChange() {
		const resKey = document.querySelector('.input-restore-key').value.trim();
		const password = document.querySelector('.input-password').value;

		this.setState({
			btnActive: resKey.length > 0 && password.length > 0,
		})
	}

	renderRedirect() {
		if ( this.state.redirect === null ) {
			return '';
		}
		else {
			return <Redirect to={this.state.redirect}/>
		}
	}

	render() {
		const style = {
			border: '1px solid #039cbf',
		};
		if ( this.state.isValid === false ) {
			style.border = '1px solid #f40b21';
		}

		return <div className="recovery_key_form_container">
			{this.renderRedirect()}
			<div className="input-group dark">
				<input type="hidden" value="something"/>
				<p className="input-label only-mobile">
						<T.span text="login_view.recovery_key.guide_rk_line1" /><br />
						<T.span text="login_view.recovery_key.guide_rk_line2" />
				</p>
				<div className="input-group-label-wrapper">
					<textarea className="input-restore-key"  placeholder={T.translate("login_view.recovery_key.placeholder")} onChange={this.onChange}
						style={style}
					/>
				
					<p className="input-label only-mobile">
						<T.span text="login_view.recovery_key.guide_password" />
					</p> <br />
					<p className="input-label gt-md">
						<T.span text="login_view.recovery_key.guide_password" />
					</p>
					<input className="input-password" placeholder={T.translate("login_view.recovery_key.pw_password")} type="password" onChange={this.onChange} autoComplete="off"
						style={style}
					/>
				</div>
			</div>
		{
		(this.state.error !== null) &&
			<p className="error">
				<T.span text={this.state.error} />
			</p>
		}
		<p className="button-wrapper">
			<BlueButton medium onClick={this.validateSeed} disabled={!this.state.btnActive}><T.span
				text="common.open" /></BlueButton>
		</p>
		</div>

		
	}
}

const mapStoreToProps = ( store ) => ({
	keypair: store.keypair.keypair,
	language: store.language.language,
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
	updateKeypair: ( $keypair, $resKey ) => {
		dispatch( actions.updateKeypair( $keypair, $resKey ) );
	},
	resetHistory: () => {
		dispatch( actions.resetHistory() );
	},
	showTimer: ( isShow ) => {
		dispatch( actions.showTimer( isShow ) );
	}
} );

RecoveryKeyForm = connect( mapStoreToProps, mapDispatchToStore )( RecoveryKeyForm );


export default RecoveryKeyForm;