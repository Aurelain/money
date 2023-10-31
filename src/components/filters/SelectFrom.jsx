import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AccountMinus from '../../ui/Icons/AccountMinus.jsx';
import {selectHistory, selectPreferredFrom} from '../../state/selectors.js';
import SelectWrapper from './SelectWrapper.jsx';
import memoHistoryComputation from '../../system/memoHistoryComputation.js';
import {FIELD_FROM} from '../../SETTINGS.js';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class SelectFrom extends React.PureComponent {
    render() {
        const {onSelect, onHold, onItemHold, isFilter, history, label = 'From', preferred, forcedOpen} = this.props;
        const {accounts} = memoHistoryComputation(history);
        return (
            <SelectWrapper
                isFilter={isFilter}
                onSelect={onSelect}
                onHold={onHold}
                onItemHold={onItemHold}
                label={label}
                preferred={preferred}
                icon={AccountMinus}
                listItems={accounts}
                data={FIELD_FROM}
                forcedOpen={forcedOpen}
            />
        );
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
SelectFrom.propTypes = {
    // -------------------------------- direct:
    isFilter: PropTypes.bool,
    onSelect: PropTypes.func,
    onHold: PropTypes.func,
    onItemHold: PropTypes.func,
    label: PropTypes.string,
    forcedOpen: PropTypes.bool,
    // -------------------------------- redux:
    history: PropTypes.array.isRequired,
    preferred: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
    return {
        history: selectHistory(state),
        preferred: selectPreferredFrom(state),
    };
};

export default connect(mapStateToProps)(SelectFrom);
