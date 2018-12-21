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
		this.props.recordSeedRedirect(false);
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
		
		return fetch(`${process.env.ANGELBOT_URL}/account/${keypair.publicKey()}?balance=100000000`, {
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
				this.props.recordSeedRedirect(false);
				this.props.updateKeypair( newPair );
				this.props.showGeneratorConfirm( false );
				this.props.showSetPassword( true );
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
										{ !process.env.TEST_MODE &&
										<div>
											{process.env.UNIT === 'BOS' ? (
												<img className={'main-logo'} src={symbolImage} alt="BOSCoin symbol"/>
											) : (
												<h1>{ process.env.COIN_NAME } Web Wallet</h1>
											)}
											<T.p className={'title'} text="welcome_view.title"/>
										</div>
										}
										{ process.env.TEST_MODE &&
										<div className="test-mode" dangerouslySetInnerHTML={{ __html: T.translate( 'welcome_view.test_mode' ) }}/>
										}

										{process.env.UNIT === 'BOS' && (
											<T.p
												className={process.env.TEST_MODE ? 'ht' : 'ht_test'}
												text={{
													key: process.env.TEST_MODE ? "welcome_view.title_description_test" : "welcome_view.title_description",
													coin_name: process.env.COIN_NAME,
												}}/>
										)}

										<div className={'button-group'}>
											{process.env.ACTIVE_MAKE_A_NEW_KEY&&
											<div>
												<BlueButton big onClick={this.clickMakeNewKey}>
													<T.span text="welcome_view.button_make"/>
												</BlueButton>
											</div>
											}

											{process.env.ACTIVE_CREATE_TEST_ACCOUNT&&
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
	showSetPassword: ( $isShow ) => {
		dispatch( actions.showSetPassword( $isShow ) );
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
	recordSeedRedirect: ( $redirect) => {
    dispatch( actions.recordSeedRedirect( $redirect) );
  },
});

MainPageView = connect( mapStoreToProps, mapDispatchToProps )( MainPageView );

export default MainPageView;