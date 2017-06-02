import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import SisLogin from 'sis-login';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
	//<App />, 
	<SisLogin>
	document.getElementById('root')
);
registerServiceWorker();
