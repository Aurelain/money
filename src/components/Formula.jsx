import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button.jsx';
import {SECONDARY_COLOR} from '../SETTINGS.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        padding: 8,
        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
        whiteSpace: 'nowrap',
        display: 'block',
        textAlign: 'left',
        backgroundColor: SECONDARY_COLOR,
        minHeight: 'auto',
        lineHeight: 1,
        fontWeight: 'bold',
    },
    buttonHover: {
        background: '#ffffbc',
    },
    buttonActive: {
        background: '#ccc47e',
    },
    accountTotal: {
        float: 'right',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Formula extends React.PureComponent {
    render() {
        const {label, data, result, onClick} = this.props;
        return (
            <Button
                name={name}
                cssNormal={SX.root}
                cssHover={SX.buttonHover}
                cssActive={SX.buttonActive}
                variant={'simple'}
                onClick={onClick}
                data={data}
                label={
                    <>
                        {label}
                        <div css={SX.accountTotal}>{result}</div>
                    </>
                }
            />
        );
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
Formula.propTypes = {
    label: PropTypes.string.isRequired,
    result: PropTypes.string,
    data: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default Formula;
