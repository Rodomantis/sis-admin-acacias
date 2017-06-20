import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import SisLogin from './sis-login.react';
import RegistrosEdificio from './registrar-expensas.react';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
	//<App />, 
	<SisLogin />,
	//<RegistrosEdificio />,
	document.getElementById('root')
);
registerServiceWorker();
