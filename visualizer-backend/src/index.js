import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Import the stylesheet you want used! Here we just reference
 * the main SCSS file we have in the styles directory.
 */
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';
import '../node_modules/react-input-range/lib/css/index.css';
import './styles/main.scss';

/**
 * Both configureStore and Root are required conditionally.
 * See configureStore.js and Root.js for more details.
 */
import { configureStore } from './store/configureStore';
import { Root } from './containers/Root';


const store = configureStore();

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
);
