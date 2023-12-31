import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {connect} from 'react-redux';
import Select from '../../ui/Select.jsx';
import {FILTER_HEIGHT, SECONDARY_COLOR} from '../../SETTINGS.js';
import memo from '../../utils/memo.js';
import CustomList from './CustomList.jsx';
import embellishLabel from '../../system/embellishLabel.js';
import {selectMeta} from '../../state/selectors.js';

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
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
    buttonHover: {
        background: '#ffffbc',
    },
    buttonActive: {
        background: '#ccc47e',
    },
    isFilter: {
        pointerEvents: 'none',
        borderTop: 'none',
        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class SelectWrapper extends React.PureComponent {
    memoRootSx = memo();

    render() {
        const {
            onSelect,
            onHold,
            onItemHold,
            isFilter,
            icon,
            label,
            preferred,
            listItems,
            meta,
            data,
            forcedOpen,
            styling,
        } = this.props;
        return (
            <Select
                cssNormal={this.memoRootSx(SX.root, isFilter && SX.isFilter, styling)}
                cssHover={SX.buttonHover}
                cssActive={SX.buttonActive}
                label={this.memoEmbellishLabel(label, preferred, meta)}
                icon={icon}
                variant={'simple'}
                list={CustomList}
                listProps={this.memoListProps(listItems, label, preferred, meta, onItemHold, styling)}
                onSelect={onSelect}
                onHold={onHold} // goes to Button
                data={data}
                forcedOpen={forcedOpen}
                tenacious={forcedOpen}
            />
        );
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    memoListProps = memoize((listItems, label, preferred, meta, onItemHold, styling) => {
        return {
            items: listItems,
            selectedValue: label,
            preferredValue: preferred,
            meta,
            onHold: onItemHold, // goes to List
            styling,
        };
    });

    /**
     *
     */
    memoEmbellishLabel = memoize((label, preferred, meta) => {
        return embellishLabel(label, preferred, meta);
    });
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
SelectWrapper.propTypes = {
    // -------------------------------- direct:
    isFilter: PropTypes.bool,
    onSelect: PropTypes.func,
    onHold: PropTypes.func,
    onItemHold: PropTypes.func,
    label: PropTypes.string.isRequired,
    preferred: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    listItems: PropTypes.array.isRequired,
    data: PropTypes.any,
    forcedOpen: PropTypes.bool,
    styling: PropTypes.object,
    // -------------------------------- redux:
    meta: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
    return {
        meta: selectMeta(state),
    };
};
export default connect(mapStateToProps)(SelectWrapper);
