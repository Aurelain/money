import React from 'react';
import {connect} from 'react-redux';
import memoHistoryComputation from '../system/memoHistoryComputation.js';
import PropTypes from 'prop-types';
import {selectFormulas, selectHistory, selectMeta} from '../state/selectors.js';
import formatNumber from '../system/formatNumber.js';
import embellishLabel from '../system/embellishLabel.js';
import Formula from './Formula.jsx';
import memoFormulaResults from '../system/memoFormulaResults.js';
import configureFormula from '../state/actions/configureFormula.js';

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
        const {history, formulas, meta} = this.props;
        const {accounts, accountsBag} = memoHistoryComputation(history);
        const results = memoFormulaResults(history, formulas);
        return (
            <div css={SX.root}>
                {formulas.map((formula, index) => {
                    const {label} = formula;
                    return (
                        <Formula
                            key={index}
                            label={label}
                            data={index}
                            result={results[index]}
                            onClick={this.onFormulaClick}
                        />
                    );
                })}
                {accounts.map((name) => {
                    return (
                        <div key={name} css={SX.account}>
                            {embellishLabel(name, '', meta)}
                            <div css={SX.accountTotal}>{formatNumber(accountsBag[name].total)}</div>
                        </div>
                    );
                })}
            </div>
        );
    }
    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    onFormulaClick = ({data: index}) => {
        configureFormula(index);
    };
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
Totals.propTypes = {
    // -------------------------------- redux:
    history: PropTypes.array.isRequired,
    formulas: PropTypes.array.isRequired,
    meta: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        history: selectHistory(state),
        formulas: selectFormulas(state),
        meta: selectMeta(state),
    };
};

export default connect(mapStateToProps)(Totals);
