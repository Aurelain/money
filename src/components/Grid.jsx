import React from 'react';
import {BAR_HEIGHT, BAR_SAFETY, GRID_HEADER_HEIGHT} from '../SETTINGS.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        position: 'fixed',
        top: BAR_HEIGHT + BAR_SAFETY,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    content: {
        position: 'relative',
        background: '#FFF59D',
        alignItems: 'center',
        display: 'flex',
        margin: 'auto',
        width: '100%',
        maxWidth: 640,
        height: GRID_HEADER_HEIGHT,
        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
    },
    column: {
        width: '25%',
        padding: 4,
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
                    <div css={SX.column}>De la</div>
                    <div css={SX.column}>Valoare</div>
                    <div css={SX.column}>Către</div>
                    <div css={SX.column}>Articol</div>
                </div>
            </div>
        );
    }
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default Grid;
