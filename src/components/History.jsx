import React from 'react';
import Button from '../ui/Button.jsx';
import {BAR_HEIGHT, BAR_SAFETY, FOOTER_SAFETY, NEW_HEIGHT} from '../SETTINGS.js';
import connectGoogle from '../state/actions/connectGoogle.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        paddingTop: BAR_HEIGHT + BAR_SAFETY + 8,
        paddingRight: 8,
        paddingBottom: NEW_HEIGHT + FOOTER_SAFETY + 8,
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
        return (
            <div css={SX.root}>
                <Button
                    label={
                        <>
                            Connect your
                            <br /> Google Calendar
                        </>
                    }
                    onClick={this.onButtonClick}
                />
            </div>
        );
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
