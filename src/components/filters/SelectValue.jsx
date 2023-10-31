import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Cash from '../../ui/Icons/Cash.jsx';
import {selectHistory, selectPreferredValue} from '../../state/selectors.js';
import SelectWrapper from './SelectWrapper.jsx';
import memoHistoryComputation from '../../system/memoHistoryComputation.js';
import {FIELD_VALUE} from '../../SETTINGS.js';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class SelectValue extends React.PureComponent {
    render() {
        const {onSelect, onHold, isFilter, history, label = 'Value', preferred} = this.props;
        const {values} = memoHistoryComputation(history);
        return (
            <SelectWrapper
                isFilter={isFilter}
                onSelect={onSelect}
                onHold={onHold}
                label={label}
                preferred={preferred}
                icon={Cash}
                listItems={values}
                data={FIELD_VALUE}
            />
        );
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
SelectValue.propTypes = {
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
        preferred: selectPreferredValue(state),
    };
};

export default connect(mapStateToProps)(SelectValue);
