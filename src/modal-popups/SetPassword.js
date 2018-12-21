import React, { Component } from 'react';
import ModalContainer from './ModalContainer';
import KeyDisplayer from 'components/KeyDisplayer';
import BlueButton from 'components/BlueButton';
import './SetPassword.scss';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import T from 'i18n-react';
import pageview from "utils/pageview";
import PasswordForm from '../components/PasswordForm';

class SetPassword extends Component {
	constructor() {
		super();

		const state = {
			step: 0
		};

		this.state = state;
	}

	doClose = () => {
		this.props.showSetPassword( false );
	};

	nextStep = () => {
		this.props.showSetPassword( false );
		this.props.showKeyGenerator( true, false );
	};

	render() {
		return (
			<ModalContainer data-lang={this.props.language} doClose={this.doClose} modalOpen={this.props.modalOpen}>
				<div className="set-password-container">
					<div>
						<h1 className="warn-header">{T.translate("set_password.header")}</h1>
						<p className="warn-body">
							{T.translate("set_password.warn_text_1")}<br />
							{T.translate("set_password.warn_text_2")}
						</p>
						<span className="under-line"> </span>
					</div>
					<PasswordForm
						callback={() => {
							this.props.showSetPassword( false );
							this.props.showKeyGenerator( true );
						}}
						doClose={() => {
							this.props.showSetPassword( false );
						}}
					/>
				</div>
			</ModalContainer>
		)
	}

	componentDidMount() {
		pageview( '/popup/set-password' );
	}
}

const mapStoreToProps = ( store ) => ( {
	language: store.language.language,
} );

const mapDispatchToProps = ( dispatch ) => ({
	showSetPassword: ( $isShow ) => {
		dispatch( actions.showSetPassword( $isShow ) );
	},
	showKeyGenerator: ( $isShow ) => {
		dispatch( actions.showKeyGenerator( $isShow ) );
	},
	updateKeypair: ( $keypair ) => {
		dispatch( actions.updateKeypair( $keypair ) );
	},
});

SetPassword = connect( mapStoreToProps, mapDispatchToProps )( SetPassword );

export default SetPassword;