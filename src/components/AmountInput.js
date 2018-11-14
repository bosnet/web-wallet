import React, { Component } from 'react';
import trimDecimal from 'utils/trimDecimal';

class AmountInput extends Component {
	onKeyDown = ( $event ) => {
		const key = $event.key;
		const BACKSPACE = 8;
		const HOME = 36;
		const END = 35;
		const DELETE = 46;
		const POINT = 190;
		const POINT_NUMPAD = 110;
		const ARROW_LEFT = 37;
		const ARROW_UP = 38;
		const ARROW_RIGHT = 39;
    const ARROW_DOWN = 40;
    
    console.log($event.key)
    console.log($event.keyCode)
		const map = [
      '.', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
			'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
			'Backspace', 'Home', 'End', 'Delete'];


		if ( map.indexOf( key ) === -1 || (key === '.' && $event.currentTarget.value.match(/[.]/)) ) {
			$event.preventDefault();
		}

		const MAX_DECIMAL_LENGTH = 7;
		const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
		
		if(NUMBERS.indexOf( key ) != -1)
		{
			var input = $event.currentTarget.value;
			if(input.indexOf(".") != -1)
			{
				var decimal = input.substr(input.indexOf(".") +1);
				
				if(decimal.length >= MAX_DECIMAL_LENGTH)
				{
					$event.preventDefault();
				}
			}
		}
	};

	onKeyUp = ( $event ) => {
		let value = $event.currentTarget.value;

		if(value.length >= 2)
		{
			var first = value.charAt(0);
			var second = value.charAt(1);

			if(first == '0' && second != '.')
			{
				value = value.substr(1);
			}
		}

		$event.currentTarget.value = value;
	};


	render() {
		return (
			<input {...this.props}
				   onKeyDown={this.onKeyDown}
					 onKeyUp={this.onKeyUp}
					 onBlur={this.onKeyUp}
				   type="number"
				   min="0.1"
				   placeholder="0.1"/>
		)
	}
}

export default AmountInput;