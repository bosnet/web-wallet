import React, { Component } from 'react';
import T from 'i18n-react';
import './HistoryTable.scss';
import { connect } from "react-redux";
import moment from 'moment';
import AmountSpan from "./AmountSpan";
import * as actions from "actions/index";
import BigNumber from "bignumber.js";

const config = require( 'config.json' );

class HistoryTable extends Component {
	RENDER_ITEM_PER = 10;

	constructor() {
		super();

		const state = {
      historyPage: 0,
      history: [],
			isLoaded: false,
			prev: null,
		};

		this.state = state;
  }

  componentDidMount() {
    const { keypair } = this.props;

    if( !keypair) {
      return;
    }

		this.props.resetHistory();
		
		let url = config.api_url;

		if (!config.test_mode) {
			url = config.main_url;
		}

    fetch(`${url}/api/v1/accounts/${keypair.publicKey()}/operations?reverse=true&limit=10`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then((data) => {
        let { records } = data._embedded;
        records = records.map(e => ({
          created: e.confirmed,
          hash: e.tx_hash,
					fee: 0.001,
					target: e.target,
          source: e.source,
          linked: e.body.linked,
					type: e.type,
					amount: new BigNumber(e.body.amount).div(10000000).toFixed(7).replace(/[0]+$/, '').replace(/[.]+$/, ''),
        }))

        this.props.streamPayment(records);
				return data._links.prev.href;
			})
			.then((prev) => {
				return fetch(`${url}${prev}`, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				})
					.then(response => response.json())
					.then((data) => {
						let { records } = data._embedded;
						if( records && records.length > 0) {
							records = records.map(e => ({
								created: e.confirmed,
								hash: e.tx_hash,
								fee: 0.001,
								target: e.target,
                source: e.source,
                linked: e.body.linked,
								type: e.type,
								amount: new BigNumber(e.body.amount).div(10000000).toFixed(7).replace(/[0]+$/, '').replace(/[.]+$/, ''),
							}))		

							this.props.streamOperations(records);

							this.setState({
								prev: data._links.prev.href,
							});
						} else {
							this.setState({
								prev: null,
							});
	
						}
					})
			})
      .then(() => {
        this.setState({
          isLoaded: true,
          historyPage: this.state.historyPage,
        })
      });
  }
  
	readMore = () => {
		const prev = this.state.prev;

		let url = config.api_url;

		if (!config.test_mode) {
			url = config.main_url;
		}

		fetch(`${url}${prev}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then((data) => {
				let { records } = data._embedded;
				if( records && records.length > 0) {
					records = records.map(e => ({
						created: e.confirmed,
						hash: e.tx_hash,
						fee: 0.001,
						target: e.target,
            source: e.source,
            linked: e.body.linked,
						type: e.type,
						amount: new BigNumber(e.body.amount).div(10000000).toFixed(7).replace(/[0]+$/, '').replace(/[.]+$/, ''),
					}))
	
					this.props.streamOperations(records);
				}

				this.setState({
					prev: data._links.prev.href,
					historyPage: this.state.historyPage + 1
				});
			})
	};

	shortAddress( $address, $length = 6 ) {
		return $address.substr( 0, $length ) + '...' + $address.substr( $length * -1 );
	}

	renderHistory = () => {
		const history = [];
    let data = this.props.paymentHistory;
    let length = data.length;
    
		if ( (this.state.historyPage + 1) * this.RENDER_ITEM_PER < length ) {
			length = (this.state.historyPage + 1) * this.RENDER_ITEM_PER;
		}

		for ( let i = 0; i < length; i++ ) {
      const payment = data[ i ];
      
			const me = this.props.keypair.publicKey();
			let amount = 0;
			let label = '';
			let target = '';
      let date = moment( payment.created ).format( 'YYYY.MM.DD HH:mm' );
      
			switch ( payment.type ) {
				case 'create-account' :
					const funder = payment.source;
					if ( funder === me ) {
						label = 'wallet_view.sent';
            target = payment.target;
            
            if (payment.linked === funder) {
              amount = new BigNumber(payment.amount).toString();
            } else {
              amount = new BigNumber(payment.amount).plus(payment.fee).toString();
            }
					
					}
					else {
						label = 'wallet_view.created_account';
						if( payment.source ) {
							target = payment.source;
						}
						else {
							target = '-';
						}
						amount = payment.amount;
					}
				
					break;
				case 'payment' :
					const from = payment.source;
					if ( me === from ) {
						label = 'wallet_view.sent';
						target = payment.target;
						amount = new BigNumber(payment.amount).plus(payment.fee).toString();
					}
					else {
						label = 'wallet_view.received';
						target = payment.source;
						amount = payment.amount;
					}
				
          break;
        case 'unfreezing-request' : // 표시 안함
          const source = payment.source;
          label = '';
          // target = source;
          // amount = new BigNumber(payment.amount).toString();
          break;
				default :
					break;
      }

			if ( label !== '' ) {
				const DOM = <div className="h-group" key={`data-${i}`}>
					<div className="col label"><T.span text={label}/></div>
					<div className="col target">{target}</div>
					<div className="col amount">
						<AmountSpan value={new BigNumber(amount).toFormat(7)}/>
					</div>
					<div className="col date">{date}</div>
				</div>;
				history.push( DOM );
			}
		}

		return history;
	};

	render() {
		const hasMore = (this.state.historyPage + 1) * this.RENDER_ITEM_PER < this.props.paymentHistory.length;
		return (
			<div className="history-table-container" data-lang={this.props.language}>
				<div data-length={this.props.paymentHistory.length}>
					{this.state.isLoaded ? this.renderHistory() : null}
				</div>
				<p className={"more-wrapper " +
				( hasMore ? 'is-more' : '')
				}>
					{ hasMore &&
					<span onClick={this.readMore}>more </span>
					}
				</p>
			</div>
		)
	}
}

const mapStoreToProps = ( store ) => ( {
	keypair: store.keypair.keypair,
	paymentHistory: store.stream.paymentHistory,
	language: store.language.language,
} );

// Redux
const mapDispatchToStore = ( dispatch ) => ( {
  streamPayment: ( $payment ) => {
		dispatch( actions.streamPayment( $payment ) );
	},
  streamOperations: ( $operations ) => {
    dispatch( actions.streamOperations( $operations ) );
  },
  resetHistory: () => {
		dispatch( actions.resetHistory() );
	},
} );

HistoryTable = connect( mapStoreToProps, mapDispatchToStore )( HistoryTable );

export default HistoryTable;