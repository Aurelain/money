import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {selectHistory, selectPreferredProduct} from '../../state/selectors.js';
import SelectWrapper from './SelectWrapper.jsx';
import memoHistoryComputation from '../../system/memoHistoryComputation.js';
import {COLOR_SUMMARY, FIELD_PRODUCT} from '../../SETTINGS.js';
import MessageProcessing from '../../ui/Icons/MessageProcessing.jsx';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    custom: {
        color: COLOR_SUMMARY,
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class SelectProduct extends React.PureComponent {
    render() {
        const {onSelect, onHold, onItemHold, isFilter, history, label = 'Summary', preferred, forcedOpen} = this.props;
        const {products} = memoHistoryComputation(history);
        return (
            <SelectWrapper
                isFilter={isFilter}
                onSelect={onSelect}
                onHold={onHold}
                onItemHold={onItemHold}
                label={label}
                preferred={preferred}
                icon={MessageProcessing}
                listItems={products}
                data={FIELD_PRODUCT}
                forcedOpen={forcedOpen}
                styling={SX.custom}
            />
        );
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
SelectProduct.propTypes = {
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
        preferred: selectPreferredProduct(state),
    };
};

export default connect(mapStateToProps)(SelectProduct);
