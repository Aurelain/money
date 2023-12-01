import React from 'react';
import PropTypes from 'prop-types';
import {SECONDARY_COLOR} from '../SETTINGS.js';
import Select from '../ui/Select.jsx';
import Sigma from '../ui/Icons/Sigma.jsx';
import FormatListGroup from '../ui/Icons/FormatListGroup.jsx';

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

const NAME_EDIT = 'NAME_EDIT';
const NAME_REPORT = 'NAME_REPORT';
const LIST_PROPS = {
    items: [
        {
            name: NAME_EDIT,
            label: 'Edit formula',
            icon: Sigma,
        },
        {
            name: NAME_REPORT,
            label: 'View report',
            icon: FormatListGroup,
        },
    ],
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Formula extends React.PureComponent {
    render() {
        const {label, data, result} = this.props;
        return (
            <Select
                cssNormal={SX.root}
                cssHover={SX.buttonHover}
                cssActive={SX.buttonActive}
                variant={'simple'}
                onSelect={this.onSelect}
                data={data}
                label={
                    <>
                        {label}
                        <div css={SX.accountTotal}>{result}</div>
                    </>
                }
                listProps={LIST_PROPS}
            />
        );
    }

    onSelect = (payload) => {
        const {onEdit, onReport} = this.props;
        switch (payload.name) {
            case NAME_EDIT:
                onEdit(payload);
                break;
            case NAME_REPORT:
                onReport(payload);
                break;
            default:
        }
    };
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
Formula.propTypes = {
    label: PropTypes.string.isRequired,
    result: PropTypes.string,
    data: PropTypes.number.isRequired,
    onEdit: PropTypes.func.isRequired,
    onReport: PropTypes.func.isRequired,
};

export default Formula;
