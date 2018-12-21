import React, { Component } from 'react';
import ModalContainer from './ModalContainer';
import BlueButton from 'components/BlueButton';
import KeyGeneratorMessage from './KeyGeneratorMessage';
import './ConfirmCheckboxes.scss';
import * as actions from "actions/index";
import { connect } from "react-redux";
import T from 'i18n-react';
import { Keypair } from 'libs/stellar-sdk';
import pageview from "utils/pageview";

class ConfirmCheckbox extends Component {
	constructor() {
		super();

		const state = {
      allChecked: false,
		};

    this.state = state;
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    console.log("CHANGE");
    
    const checkboxs = document.querySelectorAll('.confirm-checkboxs input[type="checkbox"]:checked');
    if(checkboxs.length === 4) {
      this.setState({
        allChecked: true,
      });
      this.props.onAllChecked(true);
    } else {
      this.setState({
        allChecked: false,
      });
      this.props.onAllChecked(false);
    }
  }

  render() {
		return (
      <div className="confirm-checkboxs">
        <label className="cb-container">{T.translate("confirm_checkbox.precaution_1")}
          <input type="checkbox" onChange={this.onChange}/>
          <span className="checkmark"></span>
        </label>
        <label className="cb-container">{T.translate("confirm_checkbox.precaution_2")}
          <input type="checkbox" onChange={this.onChange}/>
          <span className="checkmark"></span>
        </label>
        <label className="cb-container">{T.translate("confirm_checkbox.precaution_3")}
          <input type="checkbox" onChange={this.onChange}/>
          <span className="checkmark"></span>
        </label>
        <label className="cb-container">{T.translate("confirm_checkbox.precaution_4")}
          <input type="checkbox" onChange={this.onChange}/>
          <span className="checkmark"></span>
        </label>
        <p className={this.state.allChecked ? "transparent" : "warn-message"}>
          {T.translate("confirm_checkbox.warning")}
        </p>
      </div>
    );
  }
}

// Redux
const mapDispatchToProps = ( dispatch ) => ({
	showSpinner: ( $isShow ) => {
		dispatch( actions.showSpinner( $isShow ) );
	},
	showGeneratorConfirm: ( $isShow ) => {
		dispatch( actions.showGeneratorConfirm( $isShow ) );
	},
	updateKeypair: ( $keypair ) => {
		dispatch( actions.updateKeypair( $keypair ) );
	},
});


ConfirmCheckbox = connect( null, mapDispatchToProps )( ConfirmCheckbox );

export default ConfirmCheckbox;