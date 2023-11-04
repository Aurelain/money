import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Bar from './Bar.jsx';
import Connect from './Connect.jsx';
import Footer from './Footer.jsx';
import {selectIsAuthenticated, selectIsHealed} from '../state/selectors.js';
import {addErrorListener} from '../utils/interceptErrors.js';
import failAuthentication from '../state/actions/failAuthentication.js';
import History from './History.jsx';
import requestHistory from '../state/actions/requestHistory.js';
import Grid from './Grid.jsx';
import {USE_MOCK} from '../SETTINGS.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const VISIBILITY_EXPIRATION = 5 * 60 * 1000; // milliseconds

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class App extends React.PureComponent {
    constructionTimestamp = Date.now();

    render() {
        const {isAuthenticated} = this.props;
        return (
            <>
                <Bar />
                {isAuthenticated ? (
                    <>
                        <Grid />
                        <History />
                        <Footer />
                    </>
                ) : (
                    <Connect />
                )}
            </>
        );
    }

    componentDidMount() {
        const {isAuthenticated, isHealed} = this.props;

        if (USE_MOCK) {
            document.title += ' (MOCK)';
        }
        document.addEventListener('visibilitychange', this.onDocumentVisibilityChange);
        document.body.removeChild(document.getElementById('loading'));

        addErrorListener(this.onGlobalError);

        if (isAuthenticated) {
            // We were logged-in sometimes in the past. We should ensure we have the latest data:
            requestHistory(isHealed);
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    onDocumentVisibilityChange = async () => {
        const {isAuthenticated} = this.props;
        const hasBecomeVisible = !document.hidden;
        const isExpired = Date.now() > this.constructionTimestamp + VISIBILITY_EXPIRATION;
        if (isAuthenticated && hasBecomeVisible && isExpired) {
            window.location.reload();
        }
    };

    /**
     *
     */
    onGlobalError = ({message}) => {
        if (message.match(/grant/i) || message.match(/token/i)) {
            failAuthentication();
        }
    };
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
App.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isHealed: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    isAuthenticated: selectIsAuthenticated(state),
    isHealed: selectIsHealed(state),
});

export default connect(mapStateToProps)(App);
