// Client side of the app
// Render react components
// Add Redux storages to the app
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './components/App.js';
import store from './store.js';

ReactDOM.render(<Provider store={store}>
	<App/>
</Provider>, document.getElementById('app'));