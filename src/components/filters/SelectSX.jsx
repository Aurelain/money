import {FILTER_HEIGHT, SECONDARY_COLOR} from '../../SETTINGS.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const SelectSX = {
    root: {
        background: SECONDARY_COLOR,
        width: '25%',
        height: FILTER_HEIGHT,
        justifyContent: 'start',
        paddingLeft: 4,
        pointerEvents: 'auto',
    },
    isSelect: {
        borderTop: 'solid 1px rgba(0,0,0,0.1)',
    },
    isFilter: {
        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
    },
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default SelectSX;
