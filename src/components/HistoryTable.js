import React, { Component } from 'react';
import T from 'i18n-react';
import './HistoryTable.scss';
import { connect } from "react-redux";
import moment from 'moment';
import AmountSpan from "./AmountSpan";
import trimZero from "../utils/trimZero";
import * as actions from "actions/index";
const config = require( 'config.json' );

class HistoryTable extends Component {
	RENDER_ITEM_PER = 5;

	constructor() {
		super();

		const state = {
      historyPage: 0,
      history: [],
      isLoaded: false,
		};

		this.state = state;
  }

  componentDidMount() {
    this.buildHistory();
  }
  
  buildHistory = () => {
    const { history } = this.state;
    let data = this.props.paymentHistory;
    let length = data.length;
    const promises = [];
    
		if ( (this.state.historyPage + 1) * this.RENDER_ITEM_PER < length ) {
			length = (this.state.historyPage + 1) * this.RENDER_ITEM_PER;
    }
    
    for ( let i = 0; i < length; i++ ) {
      const payment = data[ i ];
      console.log(payment);

      // Not Loaded/api/v1/transactions/{hash}
      if(!payment.type) {
        promises.push(
          fetch(`${config.api_url}/transactions/${payment.hash}/operations`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
          
            .then(response => response.json())
            .then((data) => {
              const operation = data._embedded.records[0];
              operation.body.amount = Number(Number(operation.body.amount)/10000000).toFixed(7).replace(/[0]+$/, '').replace(/[.]+$/, '');

              this.props.streamOperations(i, operation)

              console.log(payment);
              
            })
        )
      }
    }

    Promise.all(promises)
      .then(() => {
        
        this.setState({
          isLoaded: true,
          historyPage: this.state.historyPage + 1
        })
      })

  }
  

	readMore = () => {
    this.buildHistory();
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
    console.log(data);
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
						target = payment.body.target;
					}
					else {
						label = 'wallet_view.created_account';
						if( payment.source ) {
							target = payment.source;
						}
						else {
							target = '-';
						}
					}
					amount = payment.body.amount;
					break;
				case 'payment' :
					const from = payment.source;
					if ( me === from ) {
						label = 'wallet_view.sent';
						target = payment.body.target;
					}
					else {
						label = 'wallet_view.received';
						target = payment.source;
					}
					amount = payment.body.amount;
					break;
				default :
					break;
      }
      console.log(target)
			if ( label !== '' ) {
				const DOM = <div className="h-group" key={`data-${i}`}>
					<div className="col label"><T.span text={label}/></div>
					<div className="col target">{target}</div>
					<div className="col amount">
						<AmountSpan value={ trimZero( amount ) }/>
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
  streamOperations: ( $index, $operations ) => {
    dispatch( actions.streamOperations( $index, $operations ) );
  },
} );

HistoryTable = connect( mapStoreToProps, mapDispatchToStore )( HistoryTable );

export default HistoryTable;