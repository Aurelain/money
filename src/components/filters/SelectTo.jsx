import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AccountPlus from '../../ui/Icons/AccountPlus.jsx';
import {selectHistory, selectPreferredTo} from '../../state/selectors.js';
import SelectWrapper from './SelectWrapper.jsx';
import memoHistoryComputation from '../../system/memoHistoryComputation.js';
import {COLOR_TO, FIELD_TO} from '../../SETTINGS.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    custom: {
        color: COLOR_TO,
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class SelectTo extends React.PureComponent {
    render() {
        const {onSelect, onHold, onItemHold, isFilter, history, label = 'To', preferred, forcedOpen} = this.props;
        const {accounts} = memoHistoryComputation(history);
        return (
            <SelectWrapper
                isFilter={isFilter}
                onSelect={onSelect}
                onHold={onHold}
                onItemHold={onItemHold}
                label={label}
                preferred={preferred}
                icon={AccountPlus}
                listItems={accounts}
                data={FIELD_TO}
                forcedOpen={forcedOpen}
                styling={SX.custom}
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
        preferred: selectPreferredTo(state),
    };
};

export default connect(mapStateToProps)(SelectTo);
