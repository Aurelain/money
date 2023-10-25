import React from 'react';
import {HEADER_HEIGHT, HEADER_SAFETY, FOOTER_SAFETY, GRID_HEADER_HEIGHT, FOOTER_HEIGHT} from '../SETTINGS.js';
import connectGoogle from '../state/actions/connectGoogle.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        paddingTop: HEADER_HEIGHT + HEADER_SAFETY + GRID_HEADER_HEIGHT,
        paddingRight: 8,
        paddingBottom: FOOTER_HEIGHT + FOOTER_SAFETY,
        paddingLeft: 8,
        '& > *:first-of-type': {
            marginTop: 8,
        },
        margin: 'auto',
        maxWidth: 640,
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class History extends React.PureComponent {
    render() {
        return <div css={SX.root}></div>;
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    onButtonClick = async () => {
        await connectGoogle();
    };
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
History.propTypes = {};
export default History;
