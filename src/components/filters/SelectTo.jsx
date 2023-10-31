import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AccountPlus from '../../ui/Icons/AccountPlus.jsx';
import {selectHistory, selectPreferredTo} from '../../state/selectors.js';
import SelectWrapper from './SelectWrapper.jsx';
import memoHistoryComputation from '../../system/memoHistoryComputation.js';
import {FIELD_TO} from '../../SETTINGS.js';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class SelectTo extends React.PureComponent {
    render() {
        const {onSelect, onHold, isFilter, history, label = 'To', preferred} = this.props;
        const {accounts} = memoHistoryComputation(history);
        return (
            <SelectWrapper
                isFilter={isFilter}
                onSelect={onSelect}
                onHold={onHold}
                label={label}
                preferred={preferred}
                icon={AccountPlus}
                listItems={accounts}
                data={FIELD_TO}
            />
        );
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
SelectTo.propTypes = {
    // -------------------------------- direct:
    isFilter: PropTypes.bool,
    onSelect: PropTypes.func,
    onHold: PropTypes.func,
    label: PropTypes.string,
    // -------------------------------- redux:
    history: PropTypes.array.isRequired,
    preferred: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
    return {
        history: selectHistory(state),
        preferred: selectPreferredTo(state),
    };
};

export default connect(mapStateToProps)(SelectTo);
