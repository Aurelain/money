import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Gift from '../../ui/Icons/Gift.jsx';
import {selectHistory} from '../../state/selectors.js';
import Selector from './Selector.jsx';
import memoHistoryComputation from '../../system/memoHistoryComputation.js';

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class SelectProduct extends React.PureComponent {
    render() {
        const {onSelect, isFilter, history, label = 'Product'} = this.props;
        const {products} = memoHistoryComputation(history);
        return <Selector isFilter={isFilter} onSelect={onSelect} label={label} icon={Gift} listItems={products} />;
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
SelectProduct.propTypes = {
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

export default connect(mapStateToProps)(SelectProduct);
