import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AccountMinus from '../../ui/Icons/AccountMinus.jsx';
import {selectHistory, selectPreferredFrom} from '../../state/selectors.js';
import SelectWrapper from './SelectWrapper.jsx';
import memoHistoryComputation from '../../system/memoHistoryComputation.js';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class SelectFrom extends React.PureComponent {
    render() {
        const {onSelect, isFilter, history, label = 'From', preferred} = this.props;
        const {accounts} = memoHistoryComputation(history);
        return (
            <SelectWrapper
                isFilter={isFilter}
                onSelect={onSelect}
                label={label}
                preferred={preferred}
                icon={AccountMinus}
                listItems={accounts}
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
    label: PropTypes.string,
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
