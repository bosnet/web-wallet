import React, { Component } from 'react';
import symbolImage from 'assets/imgs/WebWallet-logo.png';
import BlueButton from 'components/BlueButton';
import './MainPageView.scss';
import { connect } from "react-redux";
import * as actions from "actions/index";
import { Redirect } from "react-router-dom";
import { Keypair } from 'libs/stellar-sdk';
import T from 'i18n-react';
import moment from 'moment';
import BigNumber from "bignumber.js";
import pageview from 'utils/pageview';

const config = require( 'config.json' );

class MainPageView extends Component {
	constructor() {
		super();

		this.state = {
			redirect: null,
			contentBottom: false,
			show: true,
			hasError: true,
		};
	}

	clickMakeNewKey = () => {
		this.props.showGeneratorConfirm( true );
	};

	clickOpenYourWallet = () => {
		this.setState( { redirect: '/login' } );
	};

	renderRedirect() {
		if ( this.state.redirect === null ) {
			return '';
		}
		else {
			return <Redirect to={this.state.redirect}/>
		}
	}

	generateValidAccount = async () => {
		const keypair = Keypair.random();
		
		return fetch(`${config.angelbot_url}/account/${keypair.publicKey()}?balance=100000000`, {
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
			if(!account.status) {
				account.balance = new BigNumber(account.balance).div(10000000).toString();
				this.props.streamAccount(account);

				return keypair;
			}
			else {
				
			}
    })
	}

	createAccount() {
		this.props.showSpinner( true );
		this.generateValidAccount()
			.then( ( newPair ) => {
				this.props.showSpinner( false );
				this.props.updateKeypair( newPair );
				this.props.showGeneratorConfirm( false );
				this.props.showKeyGenerator( true );
			} );
	}

	render() {
		return (
			<div id="main-page-container" className="main-page-container">
				{this.renderRedirect()}
				<div className="content-container">
					<div className="content-middle-wrapper">
						<div className="content-wrapper">
							<div>
								{ this.props.maintenance.onMaintenance &&
								<div className="maintenance">
									<div className="text-center">
										<T.p className={'label'} text="maintenance.start_time"/>
										<div className="time">{ moment( this.props.maintenance.start_time ).format( 'YYYY-MM-DD HH:mm:ss') }</div>
										<T.p className={'label'} text="maintenance.end_time"/>
										<div className="time">{ moment( this.props.maintenance.end_time ).format( 'YYYY-MM-DD HH:mm:ss') }</div>
									</div>

									<hr/>

									<div dangerouslySetInnerHTML={{ __html: this.props.maintenance.message[ this.props.language ] }}/>
								</div>
								}
								{ !this.props.maintenance.onMaintenance &&
									<div>
										{ !config.test_mode &&
										<div>
											<img className={'main-logo'} src={symbolImage} alt="BOSCoin symbol"/>
											<T.p className={'title'} text="welcome_view.title"/>
										</div>
										}
										{ config.test_mode &&
										<div className="test-mode" dangerouslySetInnerHTML={{ __html: T.translate( 'welcome_view.test_mode' ) }}/>
										}

										<T.p
											className={config.test_mode ? 'ht' : 'ht_test'}
											text={{
												key: config.test_mode ? "welcome_view.title_description_test" : "welcome_view.title_description",
												coin_name: process.env.COIN_NAME,
											}}/>

										<div className={'button-group'}>
											{config.active_make_a_new_key&&
											<div>
												<BlueButton big onClick={this.clickMakeNewKey}>
													<T.span text="welcome_view.button_make"/>
												</BlueButton>
											</div>
											}

											{config.active_create_test_account&&
											<div>
												<BlueButton big onClick={() => this.createAccount()}>
													<T.span text="welcome_view.create_account"/>
												</BlueButton>
											</div>
											}

											<div>
												<BlueButton big onClick={this.clickOpenYourWallet}>
													<T.span text="welcome_view.button_open"/>
												</BlueButton>
											</div>

										</div>
									</div>
								}

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
	maintenance: store.maintenance,
	language: store.language.language,
});

const mapDispatchToProps = ( dispatch ) => ({
	showGeneratorConfirm: ( $isShow ) => {
		dispatch( actions.showGeneratorConfirm( $isShow ) );
	},
	showSpinner: ( $isShow ) => {
		dispatch( actions.showSpinner( $isShow ) );
	},
	showKeyGenerator: ( $isShow ) => {
		dispatch( actions.showKeyGenerator( $isShow ) );
	},
	streamAccount: ( $account ) => {
		dispatch( actions.streamAccount( $account ) );
	},
	updateKeypair: ( $keypair ) => {
		dispatch( actions.updateKeypair( $keypair ) );
	},
	resetHistory: () => {
		dispatch( actions.resetHistory() );
	},
});

MainPageView = connect( mapStoreToProps, mapDispatchToProps )( MainPageView );

export default MainPageView;