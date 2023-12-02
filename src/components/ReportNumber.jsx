import React from 'react';
import PropTypes from 'prop-types';
import formatNumber from '../system/formatNumber.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        float: 'right',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class ReportNumber extends React.PureComponent {
    render() {
        return <div css={SX.root}>{formatNumber(this.props.value)}</div>;
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
ReportNumber.propTypes = {
    value: PropTypes.number.isRequired,
};

export default ReportNumber;