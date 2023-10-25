import React from 'react';
import {
    HEADER_HEIGHT,
    HEADER_SAFETY,
    FOOTER_SAFETY,
    FOOTER_HEIGHT,
    SECONDARY_COLOR,
    FILTER_HEIGHT,
    CONTENT_MAX_WIDTH,
} from '../SETTINGS.js';
import SelectFrom from './filters/SelectFrom.jsx';
import SelectValue from './filters/SelectValue.jsx';
import SelectTo from './filters/SelectTo.jsx';
import SelectProduct from './filters/SelectProduct.jsx';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        position: 'fixed',
        top: HEADER_HEIGHT + HEADER_SAFETY,
        left: 0,
        right: 0,
        zIndex: 200,
        background: 'rgba(255,0,0,0)',
        bottom: FOOTER_HEIGHT + FOOTER_SAFETY,
        pointerEvents: 'none',
    },
    content: {
        position: 'relative',
        margin: 'auto',
        maxWidth: CONTENT_MAX_WIDTH,
        height: '100%',
        borderRight: 'solid 1px rgba(0,0,0,0.1)',
    },
    lines: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: '100%',
    },
    vertical: {
        position: 'absolute',
        left: 0,
        width: '25%',
        height: '100%',
        borderLeft: 'solid 1px rgba(0,0,0,0.1)',
        '&:nth-of-type(2)': {
            left: '25%',
        },
        '&:nth-of-type(3)': {
            left: '50%',
        },
        '&:nth-of-type(4)': {
            left: '75%',
        },
    },
    label: {
        background: SECONDARY_COLOR,
        width: '25%',
        height: FILTER_HEIGHT,
        justifyContent: 'start',
        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
        pointerEvents: 'auto',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Grid extends React.PureComponent {
    render() {
        return (
            <div css={SX.root}>
                <div css={SX.content}>
                    <SelectFrom onSelect={this.onFromSelect} isFilter={true} />
                    <SelectValue onSelect={this.onFromSelect} isFilter={true} />
                    <SelectTo onSelect={this.onFromSelect} isFilter={true} />
                    <SelectProduct onSelect={this.onFromSelect} isFilter={true} />
                    <div css={SX.lines}>
                        <div css={SX.vertical} />
                        <div css={SX.vertical} />
                        <div css={SX.vertical} />
                        <div css={SX.vertical} />
                    </div>
                </div>
            </div>
        );
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default Grid;
