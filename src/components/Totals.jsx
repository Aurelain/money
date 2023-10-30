import React from 'react';
import {connect} from 'react-redux';
import memoHistoryComputation from '../system/memoHistoryComputation.js';
import PropTypes from 'prop-types';
import {selectHistory, selectMeta} from '../state/selectors.js';
import formatNumber from '../system/formatNumber.js';
import embellishLabel from '../system/embellishLabel.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    account: {
        padding: 8,
        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
        whiteSpace: 'nowrap',
    },
    accountTotal: {
        float: 'right',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Totals extends React.PureComponent {
    render() {
        const {history, meta} = this.props;
        const {accounts, accountsBag} = memoHistoryComputation(history);
        return (
            <div css={SX.root}>
                {accounts.map((name) => {
                    return (
                        <div key={name} css={SX.account}>
                            {embellishLabel(name, '', meta)}
                            <div css={SX.accountTotal}>{formatNumber(accountsBag[name])}</div>
                        </div>
                    );
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
Totals.propTypes = {
    // -------------------------------- redux:
    history: PropTypes.array.isRequired,
    meta: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        history: selectHistory(state),
        meta: selectMeta(state),
    };
};

export default connect(mapStateToProps)(Totals);
