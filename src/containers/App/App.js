import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import config from '../../config';
import {connect} from 'react-redux';

const moment = require('../../helpers/moment');
moment().locale('pt-br');

@connect(state => ({auth: state.auth}))
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    auth: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const {user} = this.props.auth;

    return (
      <div className="main-app">
        <Helmet {...config.app.head}/>
        {this.props.children}
      </div>
    );
  }
}
