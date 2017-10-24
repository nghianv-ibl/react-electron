import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import { remote } from 'electron';

import { applyMiddleware, createStore } from 'redux';
import axios from 'axios';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

const reducer = (state = {}, action) => {
	if (action.type === 'FETCH_USERS_SUCCESS') {
		state = { ...state, users: action.payload };
	}
	return state;
};

const logger = createLogger({});

const middleware = applyMiddleware(thunk, logger);

const store = createStore(reducer, middleware);

store.dispatch(dispatch => {
	dispatch({ type: 'FETCH_USERS_START' });
	axios.get('http://rest.learncode.academy/api/wstern/users')
		.then(response => {
			dispatch({ type: 'FETCH_USERS_SUCCESS', payload: response.data });
			console.info(response.data);
		})
		.catch(error => {
			dispatch({ type: 'FETCH_USERS_ERROR', payload: error.message });
		});
});

class App extends Component {
	constructor() {
		super();
	}
	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>Welcome to React</h2>
				</div>
				<p className="App-intro">To get started, edit <code>src/App.js</code> and save to reload.</p>
			</div>
		);
	}
}

export default App;
