import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AccountMinus from '../../ui/Icons/AccountMinus.jsx';
import {selectHistory} from '../../state/selectors.js';
import Selector from './Selector.jsx';
import memoHistoryComputation from '../../system/memoHistoryComputation.js';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class SelectFrom extends React.PureComponent {
    render() {
        const {onSelect, isFilter, history} = this.props;
        const {accounts} = memoHistoryComputation(history);
        return (
            <Selector isFilter={isFilter} onSelect={onSelect} label={'From'} icon={AccountMinus} listItems={accounts} />
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
    // -------------------------------- redux:
    history: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
    return {
        history: selectHistory(state),
    };
};

export default connect(mapStateToProps)(SelectFrom);
