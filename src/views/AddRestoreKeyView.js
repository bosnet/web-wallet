import React, { Component } from 'react';
import BlueButton from 'components/BlueButton';
import { Redirect } from "react-router-dom";
import { StellarTools } from 'libs/stellar-toolkit';
import * as actions from "actions/index";
import { connect } from "react-redux";
import T from 'i18n-react';
import StreamManager from "../StreamManager";
import pageview from 'utils/pageview';
import PasswordForm from '../components/PasswordForm';

class AddRestoreKeyView extends Component {
	constructor() {
		super();

		this.state = {
			redirect: null,
			isValid: null,
    };
	}


	renderRedirect() {
		// if ( this.props.keypair === null ) {
		// 	return <Redirect to={'/'}/>;
    // }
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
		return (
			<div className="login-container">
        {this.renderRedirect()}
				<div className="content-container">
					<div className="content-middle-wrapper">
						<div className="content-wrapper">
							<div>
								<h1>
									{T.translate("set_password.header")}
								</h1>
                <p>
									{T.translate("set_password.warn_text_1")}<br />
									{T.translate("set_password.warn_text_2")}
								</p>
								<span className="under-line-blue"> </span>
                <PasswordForm
                  callback={() => {
                    this.setState({
                      redirect: "/wallet"
                    });
                    this.props.showKeyGenerator( true );
                  }}
                  doClose={() => {
                    this.setState({
                      redirect: "/login"
                    });
                  }}
                />
							</div>
						</div>
					</div>
				</div>

			</div>
		)
	}

	componentDidMount() {
		pageview();
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
  },
  showKeyGenerator: ( $isShow ) => {
		dispatch( actions.showKeyGenerator( $isShow ) );
  },
  recordSeedRedirect: ( $redirect) => {
    dispatch( actions.recordSeedRedirect( $redirect) );
  }
} );

AddRestoreKeyView = connect( mapStoreToProps, mapDispatchToStore )( AddRestoreKeyView );

export default AddRestoreKeyView;