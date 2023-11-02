import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button.jsx';
import memo from '../utils/memo.js';
import clearFocusedDate from '../state/actions/clearFocusedDate.js';
import formatNumber from '../system/formatNumber.js';
import deleteRow from '../state/actions/deleteRow.js';

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
        background: 'rgba(0,0,0,0.05)',
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
// const SX_AMOUNT = {...SX.column, textAlign: 'right'};

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
                cssNormal={this.memoRootSx(SX.root, isVirtual && SX.isVirtual)}
                style={isSelected ? SX.isSelected : {}}
                label={
                    <>
                        <div css={SX.column}>{from + fromSuffix}</div>
                        <div css={SX.column}>{formatNumber(value)}</div>
                        <div css={SX.column}>{to + toSuffix}</div>
                        <div css={SX.column}>{product}</div>
                    </>
                }
                variant={'simple'}
                // onClick={this.onRootClick}
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
        const {from, value, to, product, date} = this.props;
        const lines = [];
        lines.push(`From: ${from}`);
        lines.push(`Amount: ${value}`);
        lines.push(`To: ${to}`);
        lines.push(`Summary: ${product}`);
        lines.push(`Date: ${prettifyDate(date)}`);
        lines.push('');
        lines.push('Are you sure you want to delete this transaction?');
        const reply = confirm(lines.join('\n'));
        if (reply) {
            deleteRow(date);
        }
    };
}
// =====================================================================================================================
//  H E L P E R S
// =====================================================================================================================
/**
 *
 */
const prettifyDate = (date) => {
    const matched = date.match(/(.*?)T(\d\d:\d\d)/);
    return matched[1] + ', ' + matched[2];
};

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
