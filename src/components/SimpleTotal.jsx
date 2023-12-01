import React from 'react';
import PropTypes from 'prop-types';
import Select from '../ui/Select.jsx';
import FormatListGroup from '../ui/Icons/FormatListGroup.jsx';
import Incognito from '../ui/Icons/Incognito.jsx';

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
        minHeight: 'auto',
        lineHeight: 1,
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

const NAME_ALIAS = 'NAME_ALIAS';
const NAME_REPORT = 'NAME_REPORT';
const LIST_PROPS = {
    items: [
        {
            name: NAME_ALIAS,
            label: 'Edit alias',
            icon: Incognito,
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
class SimpleTotal extends React.PureComponent {
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
        const {onAlias, onReport} = this.props;
        switch (payload.name) {
            case NAME_ALIAS:
                onAlias(payload);
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
SimpleTotal.propTypes = {
    label: PropTypes.string.isRequired,
    result: PropTypes.string,
    data: PropTypes.any,
    onAlias: PropTypes.func.isRequired,
    onReport: PropTypes.func.isRequired,
};

export default SimpleTotal;
