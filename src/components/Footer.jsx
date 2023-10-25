import React from 'react';
import memoize from 'memoize-one';
import {
    FOOTER_SAFETY,
    FOOTER_HEIGHT,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
    FILTER_HEIGHT,
    CONTENT_MAX_WIDTH,
} from '../SETTINGS.js';
import Button from '../ui/Button.jsx';
import Plus from '../ui/Icons/Plus.jsx';
import TrashCan from '../ui/Icons/TrashCan.jsx';
import defocus from '../utils/defocus.js';
import Database from '../ui/Icons/Database.jsx';
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
        bottom: 0,
        left: 0,
        right: 0,
        height: FILTER_HEIGHT + FOOTER_HEIGHT + FOOTER_SAFETY,
        zIndex: 100,
    },
    content: {
        position: 'relative',
        margin: 'auto',
        maxWidth: CONTENT_MAX_WIDTH,
        height: '100%',
    },
    selectors: {},
    selectorButton: {
        background: SECONDARY_COLOR,
        width: '25%',
        height: FILTER_HEIGHT,
        justifyContent: 'start',
        borderTop: 'solid 1px rgba(0,0,0,0.1)',
    },
    commandLine: {
        height: FOOTER_HEIGHT + FOOTER_SAFETY,
        paddingBottom: FOOTER_SAFETY,
        background: PRIMARY_COLOR,
        display: 'flex',
        flexDirection: 'row',
        borderTop: 'solid 1px rgba(0,0,0,0.1)',
    },
    selectCalendar: {
        padding: '0 8px',
    },
    field: {
        flexGrow: 1,
        width: '100%',
        border: 'none',
        borderRadius: 20,
        padding: '0 16px',
        margin: 8,
        appearance: 'none',
        background: '#fff',
        resize: 'none',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        lineHeight: '30px',
        overflow: 'hidden',
    },
    plus: {
        height: '100%',
        padding: 8,
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Footer extends React.PureComponent {
    state = {
        value: '',
    };

    render() {
        const {value} = this.state;
        return (
            <div css={SX.root}>
                <div css={SX.content}>
                    <SelectFrom onSelect={this.onFromSelect} />
                    <SelectValue onSelect={this.onFromSelect} />
                    <SelectTo onSelect={this.onFromSelect} />
                    <SelectProduct onSelect={this.onFromSelect} />
                    <div css={SX.commandLine}>
                        {/*
                        We avoid issues with autoComplete and the credit-card bar showing by using <textarea>.
                        Reference:
                        - https://stackoverflow.com/a/73466347/844393
                        - https://gist.github.com/niksumeiko/360164708c3b326bd1c8
                        */}
                        <textarea
                            autoComplete={'off'}
                            css={SX.field}
                            spellCheck={false}
                            value={value}
                            onChange={this.onInputChange}
                            onKeyDown={this.onInputKeyDown}
                        />
                        <Button
                            icon={Plus}
                            holdIcon={TrashCan}
                            cssNormal={SX.plus}
                            variant={'inverted'}
                            onClick={this.onPlusClick}
                            onHold={this.onPlusHold}
                            disabled={!value}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    onInputChange = (event) => {
        const {value} = event.target;
        this.setState({value});
    };

    /**
     *
     */
    onInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.create();
            defocus();
        }
    };

    /**
     *
     */
    onPlusClick = () => {
        this.create();
    };

    /**
     *
     */
    create = () => {
        const {value} = this.state;
        this.setState({value: ''});
    };

    /**
     *
     */
    onFromSelect = () => {
        // TODO
    };
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default Footer;
