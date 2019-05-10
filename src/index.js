import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import 'normalize.css';

import App from './app';

FastClick.attach(document.body);

ReactDOM.render(<App />, document.getElementById('app'));
