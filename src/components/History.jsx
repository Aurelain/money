import React from 'react';
import {BAR_HEIGHT, BAR_SAFETY, FOOTER_SAFETY, GRID_HEADER_HEIGHT, NEW_HEIGHT} from '../SETTINGS.js';
import connectGoogle from '../state/actions/connectGoogle.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        paddingTop: BAR_HEIGHT + BAR_SAFETY + GRID_HEADER_HEIGHT,
        paddingRight: 8,
        paddingBottom: NEW_HEIGHT + FOOTER_SAFETY,
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
