import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button.jsx';
import memo from '../utils/memo.js';
import formatNumber from '../system/formatNumber.js';
import deleteRow from '../state/actions/deleteRow.js';
import {BAD, COLOR_AMOUNT, COLOR_FROM, COLOR_SUMMARY, COLOR_TO, GOOD, SECONDARY_COLOR} from '../SETTINGS.js';
import EMPTY_OBJECT from '../utils/EMPTY_OBJECT.js';
import decideMorality from '../system/decideMorality.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
    },
    hover: {
        background: SECONDARY_COLOR,
    },
    column: {
        width: '25%',
        textAlign: 'left',
        padding: 4,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontWeight: 500,
    },
    isSelected: {
        background: 'red',
        color: 'white',
    },
    isVirtual: {
        opacity: 0.3,
    },
    date: {
        position: 'absolute',
        top: 1,
        left: 0,
        padding: 4,
        background: 'red',
        color: 'white',
    },
    good: {
        background: 'rgba(0,255,0,0.1)',
    },
    bad: {
        background: 'rgba(255,0,0,0.1)',
    },
};
const SX_FROM = {...SX.column, color: COLOR_FROM};
const SX_AMOUNT = {...SX.column, color: COLOR_AMOUNT};
const SX_TO = {...SX.column, color: COLOR_TO};
const SX_SUMMARY = {...SX.column, color: COLOR_SUMMARY};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Row extends React.PureComponent {
    memoRootSx = memo();
    render() {
        const {from, value, to, product, isSelected, isVirtual, meta} = this.props;

        const fromSuffix = meta[from]?.suffix || '';
        const toSuffix = meta[to]?.suffix || '';
        const morality = decideMorality(from, to);
        return (
            <Button
                cssNormal={this.memoRootSx(
                    SX.root,
                    isVirtual && SX.isVirtual,
                    morality === GOOD && SX.good,
                    morality === BAD && SX.bad,
                )}
                cssHover={SX.hover}
                style={isSelected ? SX.isSelected : EMPTY_OBJECT}
                label={
                    <>
                        <div css={SX_FROM}>{from + fromSuffix}</div>
                        <div css={SX_AMOUNT}>{formatNumber(value)}</div>
                        <div css={SX_TO}>{to + toSuffix}</div>
                        <div css={SX_SUMMARY}>{product}</div>
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
    onRootHold = () => {
        const {from, value, to, product, date} = this.props;
        const lines = [];
        lines.push(`From:           ${from}`);
        lines.push(`Amount:      ${formatNumber(value)}`);
        lines.push(`To:               ${to}`);
        lines.push(`Summary:    ${product}`);
        lines.push(`Date:           ${prettifyDate(date)}`);
        lines.push('');
        lines.push('If you want to delete this transaction, type "DEL":');
        const reply = prompt(lines.join('\n'));
        if (reply?.match(/^DEL$/i)) {
            deleteRow(date);
        }
        // lines.push('Are you sure you want to delete this transaction?');
        // const reply = confirm(lines.join('\n'));
        // if (reply) {
        //     deleteRow(date);
        // }
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
