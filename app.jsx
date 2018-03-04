import React from 'react';
import ReactDOM from 'react-dom';
// import GMap from './frontend/g_map';
import GMap from './frontend/g_map';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<GMap />, document.getElementById('main'));
});
