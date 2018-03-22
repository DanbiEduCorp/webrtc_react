import '../stylesheet/root.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';

import { path as commonPath, service } from './commons/configs';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { ConnectedRouter as Router, routerReducer, routerMiddleware } from 'react-router-redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

import { createBrowserHistory } from 'history';
import * as reducers from './redux/reducers';

import App from './App';
// import registerServiceWorker from './registerServiceWorker';

import {AuthRoute} from 'wink_mobile_commons/dist/security/components';

import io from 'socket.io-client';
import {socket as execute} from './redux/executors';
import {socket as createSocketIoMiddleware } from './redux/middlewares';

import { Login, Page404, Page500 } from './layout';

// const history = createBrowserHistory({basename: '/browser/www'});
const history = createBrowserHistory();

const middleware = routerMiddleware(history);
const loggerMiddleware = createLogger({
    collapsed: (getState, action, logEntry) => true
});

// const socket = io(service.getUrl());
// const socketIoMiddleware = createSocketIoMiddleware(socket, "@@SOCKET/", { execute: execute(socket), eventName: 'message' });

const store = createStore(
    combineReducers({
        ...reducers,
        router: routerReducer
    }),
    applyMiddleware(
        middleware,
        thunkMiddleware,
        // socketIoMiddleware,
        loggerMiddleware
    )
);

const Root = () => (
    <Provider store={store}>
        <Router history={history}>
            <div className="app-wrap">
                <Switch>
                    <Route exact path={commonPath.login} name="Login Page" component={Login}/>
                    <Route exact path={commonPath.notFound} name="Page 404" component={Page404}/>
                    <Route exact path={commonPath.serverError} name="Page 500" component={Page500}/>
                    <AuthRoute path={commonPath.home} name="home" component={App}/>
                </Switch>
            </div>
        </Router>
    </Provider>
);


ReactDOM.render(<Root />, document.getElementById('root'));
// registerServiceWorker();
