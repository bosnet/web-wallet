import React, { Component } from 'react';
import './AmountSpan.scss';
class AmountSpan extends Component {
	render() {
		return <span className={ 'amount-span' }>
			{/* <span className={ 'amount-span-integer' }>{ integer }</span>
			.
      <span className={ 'amount-span-decimal' }>{ decimal }</span> */}
      {this.props.value}
		</span>;
	}
}

export default AmountSpan;