import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import AV from 'leancloud-storage';
import 'whatwg-fetch';
import 'normalize.css';

import App from './app';

if (process.env.NODE_ENV === 'development') {
  localStorage.setItem('debug', 'leancloud*,LC*');
}

FastClick.attach(document.body);

// TODO: 通过配置来注入
AV.init({
  appId: 'JnT1jrC3EhBnmPAIEUWcOBWN-gzGzoHsz',
  appKey: 'a1TmPNIcFWuvKsOr0gGw3afg',
});

ReactDOM.render(<App />, document.getElementById('app'));
