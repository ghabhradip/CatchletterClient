import React from 'react';
import ReactDOM from 'react-dom';

import Main from './js/common/components/index';
import './styles/stylesheet.css';
import './../src/assets/fonts/themify-icons.css';
import './styles/bootstrap.css';
import './styles/bootstrap.min.css';
import './styles/responsive.css';
import './styles/slick.css';
import './styles/theme.css';
import '../src/assets/font-awesome/css/font-awesome.min.css';

import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import rootReducer from './redux/reducer';
import { Provider } from 'react-redux';

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Main />
        </BrowserRouter>

    </Provider>,
    document.getElementById("root")
);