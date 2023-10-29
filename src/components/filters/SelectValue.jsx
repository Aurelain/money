import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Cash from '../../ui/Icons/Cash.jsx';
import {selectHistory} from '../../state/selectors.js';
import Selector from './Selector.jsx';
import memoHistoryComputation from '../../system/memoHistoryComputation.js';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class SelectValue extends React.PureComponent {
    render() {
        const {onSelect, isFilter, history, label = 'Value'} = this.props;
        const {values} = memoHistoryComputation(history);
        return <Selector isFilter={isFilter} onSelect={onSelect} label={label} icon={Cash} listItems={values} />;
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
SelectValue.propTypes = {
    // -------------------------------- direct:
    isFilter: PropTypes.bool,
    onSelect: PropTypes.func,
    label: PropTypes.string,
    // -------------------------------- redux:
    history: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
    return {
        history: selectHistory(state),
    };
};

export default connect(mapStateToProps)(SelectValue);
