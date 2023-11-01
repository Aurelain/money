import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button.jsx';
import focusDate from '../state/actions/focusDate.js';
import memo from '../utils/memo.js';
import clearFocusedDate from '../state/actions/clearFocusedDate.js';

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
    isVirtual: {
        opacity: 0.8,
        fontStyle: 'italic',
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
        const {from, value, to, product, isSelected, isVirtual, meta} = this.props;

        const fromSuffix = meta[from]?.suffix || '';
        const toSuffix = meta[to]?.suffix || '';
        return (
            <Button
                css={this.memoRootSx(SX.root, isSelected && SX.isSelected, isVirtual && SX.isVirtual)}
                label={
                    <>
                        <div css={SX.column}>{from + fromSuffix}</div>
                        <div css={SX.column}>{value}</div>
                        <div css={SX.column}>{to + toSuffix}</div>
                        <div css={SX.column}>{product}</div>
                    </>
                }
                variant={'simple'}
                onClick={this.onRootClick}
                onHold={this.onRootHold}
                // onClick={this.onRootHold}
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
        const {isSelected} = this.props;
        if (isSelected) {
            clearFocusedDate();
        }
    };

    /**
     *
     */
    onRootHold = () => {
        const {date, isSelected} = this.props;
        if (isSelected) {
            clearFocusedDate();
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
    isVirtual: PropTypes.bool.isRequired,
    meta: PropTypes.objectOf(
        PropTypes.shape({
            alias: PropTypes.string.isRequired,
            suffix: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

export default Row;
