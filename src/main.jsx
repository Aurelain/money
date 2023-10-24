import './utils/interceptConsole.js';
import './utils/interceptErrors.js';
import store from './state/store.js';
import {Provider} from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';
import resurrectState from './state/actions/resurrectState.js';
import GlobalStyles from './components/GlobalStyles.jsx';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const run = async () => {
    await navigator.serviceWorker?.register('./sw.js', {scope: './'});

    // Restore the state from IndexedDB into Redux. This usually only takes a few milliseconds.
    await resurrectState();

    // We're not using <React.StrictMode> in order to avoid 2 renders:
    // https://upmostly.com/tutorials/why-is-my-useeffect-hook-running-twice-in-react
    ReactDOM.createRoot(document.getElementById('root')).render(
        <Provider store={store}>
            <GlobalStyles>
                <App />
            </GlobalStyles>
        </Provider>,
    );
};

// =====================================================================================================================
//  R U N
// =====================================================================================================================
run();
