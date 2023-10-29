import React from 'react';
import {
    HEADER_HEIGHT,
    HEADER_SAFETY,
    FOOTER_SAFETY,
    FOOTER_HEIGHT,
    FILTER_HEIGHT,
    CONTENT_MAX_WIDTH,
} from '../SETTINGS.js';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {selectHistory, selectFocusedDate, selectMeta} from '../state/selectors.js';
import Row from './Row.jsx';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        paddingTop: HEADER_HEIGHT + HEADER_SAFETY + FILTER_HEIGHT,
        paddingBottom: FOOTER_HEIGHT + FOOTER_SAFETY + FILTER_HEIGHT + 64,
        margin: 'auto',
        maxWidth: CONTENT_MAX_WIDTH,
        display: 'flex',
        flexDirection: 'column',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class History extends React.PureComponent {
    render() {
        const {history, focusedDate, meta} = this.props;
        return (
            <div css={SX.root}>
                {history.map((row) => {
                    const {date} = row;
                    return <Row key={date} {...row} isSelected={focusedDate === date} meta={meta} />;
                })}
            </div>
        );
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
History.propTypes = {
    // -------------------------------- redux:
    history: PropTypes.array.isRequired,
    focusedDate: PropTypes.string,
    meta: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    history: selectHistory(state),
    focusedDate: selectFocusedDate(state),
    meta: selectMeta(state),
});

export default connect(mapStateToProps)(History);
