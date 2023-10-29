import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import Select from '../../ui/Select.jsx';
import {FILTER_HEIGHT, SECONDARY_COLOR} from '../../SETTINGS.js';
import memo from '../../utils/memo.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        background: SECONDARY_COLOR,
        width: '25%',
        height: FILTER_HEIGHT,
        justifyContent: 'start',
        paddingLeft: 4,
        pointerEvents: 'auto',
        color: '#49220b',
        fontWeight: 'bold',
        borderTop: 'solid 1px rgba(0,0,0,0.1)',
    },
    buttonHover: {
        background: '#ffffbc',
    },
    buttonActive: {
        background: '#ccc47e',
    },
    isFilter: {
        borderTop: 'none',
        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Selector extends React.PureComponent {
    memoRootSx = memo();

    render() {
        const {onSelect, isFilter, icon, label, listItems} = this.props;
        return (
            <Select
                cssNormal={this.memoRootSx(SX.root, isFilter && SX.isFilter)}
                cssHover={SX.buttonHover}
                cssActive={SX.buttonActive}
                label={label}
                icon={icon}
                variant={'simple'}
                listProps={this.memoListProps(listItems)}
                onSelect={onSelect}
            />
        );
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    memoListProps = memoize((listItems) => {
        return {
            items: listItems,
        };
    });
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
Selector.propTypes = {
    isFilter: PropTypes.bool,
    onSelect: PropTypes.func,
    label: PropTypes.string.isRequired,
    icon: PropTypes.func.isRequired,
    listItems: PropTypes.array.isRequired,
};

export default Selector;
