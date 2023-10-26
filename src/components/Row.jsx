import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button.jsx';
import focusDate from '../state/actions/focusDate.js';
import memo from '../utils/memo.js';
import clearFocus from '../state/actions/clearFocus.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
    },
    column: {
        width: '25%',
        textAlign: 'left',
        padding: 4,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    isSelected: {
        background: 'red',
        color: 'white',
    },
    date: {
        position: 'absolute',
        top: 1,
        left: 0,
        padding: 4,
        background: 'red',
        color: 'white',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Row extends React.PureComponent {
    memoRootSx = memo();
    render() {
        const {from, value, to, product, isSelected} = this.props;

        return (
            <Button
                css={this.memoRootSx(SX.root, isSelected && SX.isSelected)}
                label={
                    <>
                        <div css={SX.column}>{from}</div>
                        <div css={SX.column}>{value}</div>
                        <div css={SX.column}>{to}</div>
                        <div css={SX.column}>{product}</div>
                    </>
                }
                variant={'simple'}
                onClick={this.onRootClick}
            />
        );
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    onRootClick = () => {
        const {date, isSelected} = this.props;
        if (isSelected) {
            clearFocus();
        } else {
            focusDate(date);
        }
    };
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
Row.propTypes = {
    spreadsheetId: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    to: PropTypes.string.isRequired,
    product: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
};

export default Row;
