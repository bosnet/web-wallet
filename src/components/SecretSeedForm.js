import React, { Component } from 'react';
import './SecretSeedForm.scss';
import { Redirect } from "react-router-dom";
import T from 'i18n-react';
import BlueButton from 'components/BlueButton';
import StreamManager from "../StreamManager";
import { StellarTools } from 'libs/stellar-toolkit';
import store from '../observables/store';
import BigNumber from "bignumber.js";
import { connect } from "react-redux";
import * as actions from "actions/index";

class SecretSeedForm extends Component {
	constructor() {
		super();

		this.state = {
			redirect: null,
			isValid: null,
		};

		this.onChange = this.onChange.bind(this);
	}

	openWallet = () => {
		const checkbox = document.querySelector('.checkbox').checked;

		if ( this.state.isValid ) {
			this.props.showTimer( true );

			if (checkbox) {
				this.props.recordSeedRedirect(true);
				this.setState( { redirect: '/add_reskey' } );
			} else {
				this.setState( { redirect: '/wallet' } );
			}
		}
	};

	requestAccount = ( keypair ) => {
    fetch(`${process.env.API_URL}/api/v1/accounts/${keypair.publicKey()}`, {
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
            this.setState( { isValid: false } );
    
            return;
          }
    
          if(account.balance && account.balance === 0) {
            this.props.updateKeypair( null );
            this.setState( { isValid: false } );
    
            return;
          }
    
          account.balance = new BigNumber(account.balance).div(10000000).toString();
          this.props.streamAccount(account);
          this.props.updateKeypair(keypair);
          store.keypair = keypair;

          this.setState({ isValid: true });       
        }
      }
      else {
        StreamManager.stopAllStream();
        this.props.resetHistory();

        // Confirm Account Valid
        if(account.status) {
          this.props.updateKeypair( null );
          this.setState( { isValid: false } );
  
          return;
        }
  
        if(account.balance && account.balance === 0) {
          this.props.updateKeypair( null );
          this.setState( { isValid: false } );
  
          return;
        }
  
        account.balance = new BigNumber(account.balance).div(10000000).toString();
        this.props.streamAccount(account);
        this.props.updateKeypair(keypair);
        store.keypair = keypair;
        this.setState({ isValid: true });
      }

      this.props.updateKeypair( keypair );
      store.keypair = keypair;

      this.setState({ isValid: true });
    })
    .catch( error => {
      this.props.updateKeypair( null );
      this.setState( { isValid: false } );
    });
    
	};

	validateSeed = ( $event ) => {
		const value = $event.currentTarget.value.trim();
		const isValid = StellarTools.validSeed( value );
		if ( isValid ) {
			const keypair = StellarTools.KeypairInstance( { secretSeed: value } );

			if( this.props.keypair ) {
				if( this.props.keypair.publicKey() !== keypair.publicKey() ) {
					this.requestAccount( keypair );
				}
				else {
					this.setState( { isValid: true } );
				}
			}
			else {
				this.requestAccount( keypair );
			}
		}
		else {
			this.setState( { isValid: false } );
		}
	};

	onChange() {
		const checkbox = document.querySelector('.checkbox').checked;
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

		return <div className="secret_seed_form_container">
			{this.renderRedirect()}
			<p>
				<T.span text="login_view.guide_line_1" /><br />
				<T.span text="login_view.guide_line_2" />
			</p>

			<textarea placeholder={T.translate('login_view.secret_seed.placeholder')} onChange={this.validateSeed}
				style={style}
			/>
			<label className="cb-container">{T.translate("login_view.secret_seed.checkbox_text")}
			<input type="checkbox" className="checkbox" onChange={this.onChange} />
				<span className="checkmark"></span>
			</label>
		{
		(this.state.isValid !== null && this.state.isValid === false) &&
			<p className="error">
				<T.span text="login_view.error.invalid_secret_seed" />
			</p>
		}
		<p className="button-wrapper">
			<BlueButton medium onClick={this.openWallet} disabled={!this.state.isValid}><T.span
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
	updateKeypair: ( $keypair ) => {
		dispatch( actions.updateKeypair( $keypair ) );
  },
	resetHistory: () => {
		dispatch( actions.resetHistory() );
	},
	showTimer: ( isShow ) => {
		dispatch( actions.showTimer( isShow ) );
	},
	showSetPassword: ( $isShow ) => {
		dispatch( actions.showSetPassword( $isShow ) );
	},
	recordSeedRedirect: ( $redirect) => {
    dispatch( actions.recordSeedRedirect( $redirect) );
  },
} );

SecretSeedForm = connect( mapStoreToProps, mapDispatchToStore )( SecretSeedForm );


export default SecretSeedForm;