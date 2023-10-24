import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Bar from './Bar.jsx';
import Connect from './Connect.jsx';
import Footer from './Footer.jsx';
import {selectIsAuthenticated} from '../state/selectors.js';
import {addErrorListener} from '../utils/interceptErrors.js';
import failAuthentication from '../state/actions/failAuthentication.js';
import History from './History.jsx';

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
                {!isAuthenticated && <Connect />}
                {isAuthenticated && <History />}
                {isAuthenticated && <Footer />}
            </>
        );
    }

    componentDidMount() {
        document.addEventListener('visibilitychange', this.onDocumentVisibilityChange);
        document.body.removeChild(document.getElementById('spinner'));

        addErrorListener(this.onGlobalError);

        if (this.props.isAuthenticated) {
            // We were logged-in sometimes in the past. We should ensure we have the latest data:
            this.syncWithCloud();
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
            window.scrollTo(0, 0);
            window.location.reload();
        }
    };

    /**
     *
     */
    syncWithCloud = async () => {
        // TODO
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
};

const mapStateToProps = (state) => ({
    isAuthenticated: selectIsAuthenticated(state),
});

export default connect(mapStateToProps)(App);
