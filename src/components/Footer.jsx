import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import gsap from 'gsap';
import memoize from 'memoize-one';
import {
    CONTENT_MAX_WIDTH,
    FILTER_HEIGHT,
    FOOTER_HEIGHT,
    FOOTER_SAFETY,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
} from '../SETTINGS.js';
import Button from '../ui/Button.jsx';
import Plus from '../ui/Icons/Plus.jsx';
import TrashCan from '../ui/Icons/TrashCan.jsx';
import defocus from '../utils/defocus.js';
import SelectFrom from './filters/SelectFrom.jsx';
import SelectValue from './filters/SelectValue.jsx';
import SelectTo from './filters/SelectTo.jsx';
import SelectProduct from './filters/SelectProduct.jsx';
import {selectDefaults, selectFocusedDate, selectMeta} from '../state/selectors.js';
import memo from '../utils/memo.js';
import Close from '../ui/Icons/Close.jsx';
import clearFocus from '../state/actions/clearFocus.js';
import parseCommand from '../system/parseCommand.js';

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
        position: 'relative',
        height: FOOTER_HEIGHT + FOOTER_SAFETY,
        paddingBottom: FOOTER_SAFETY,
        background: PRIMARY_COLOR,
        display: 'flex',
        flexDirection: 'row',
        borderTop: 'solid 1px rgba(0,0,0,0.1)',
    },
    focused: {
        background: 'red',
    },
    focusedButton: {
        padding: 8,
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
    date: {
        position: 'absolute',
        top: 10,
        right: 96,
        padding: 6,
        background: 'red',
        color: 'white',
        borderRadius: 12,
        pointerEvents: 'none',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Footer extends React.PureComponent {
    memoCommandLineCss = memo();
    focusedRef = React.createRef();
    state = {
        command: '',
    };

    render() {
        const {focusedDate, defaults, meta} = this.props;
        const {command} = this.state;
        const {from, value, to, product} = this.memoSelectValues(command, defaults, meta);
        return (
            <div css={SX.root}>
                <div css={SX.content}>
                    <SelectFrom onSelect={this.onFromSelect} label={from} />
                    <SelectValue onSelect={this.onFromSelect} label={value} />
                    <SelectTo onSelect={this.onFromSelect} label={to} />
                    <SelectProduct onSelect={this.onFromSelect} label={product} />
                    <div css={this.memoCommandLineCss(SX.commandLine, focusedDate && SX.focused)}>
                        {focusedDate && (
                            <Button
                                icon={TrashCan}
                                cssNormal={SX.focusedButton}
                                variant={'inverted'}
                                onClick={this.onTrashClick}
                            />
                        )}
                        {focusedDate && (
                            <div ref={this.focusedRef} css={SX.date}>
                                {prettifyDate(focusedDate)}
                            </div>
                        )}
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
                            value={command}
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
                            disabled={!command}
                        />
                        {focusedDate && (
                            <Button
                                icon={Close}
                                cssNormal={SX.focusedButton}
                                variant={'inverted'}
                                onClick={this.onCloseClick}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        const {focusedDate} = this.props;
        if (prevProps.focusedDate !== focusedDate) {
            if (focusedDate) {
                gsap.fromTo(this.focusedRef.current, {opacity: 1}, {opacity: 0, delay: 0.5});
            }
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    onInputChange = (event) => {
        const {value} = event.target;
        this.setState({command: value});
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
        const {focusedDate} = this.props;
        const {command} = this.state;
        console.log('create:', command);
        if (focusedDate) {
            // TODO
            clearFocus();
        } else {
            // TODO
        }
        this.setState({command: ''});
    };

    /**
     *
     */
    onFromSelect = ({name}) => {
        console.log('onFromSelect:', name);
    };

    /**
     *
     */
    onTrashClick = () => {
        console.log('onTrashClick');
    };

    /**
     *
     */
    onCloseClick = () => {
        clearFocus();
    };

    /**
     *
     */
    memoSelectValues = memoize((command, defaults, meta) => {
        return parseCommand({command, defaults, meta});
    });
}

// =====================================================================================================================
//  H E L P E R S
// =====================================================================================================================
/**
 *
 */
const prettifyDate = (date) => {
    const matched = date.match(/(.*?)T(\d\d:\d\d)/);
    return matched[1] + ', ' + matched[2];
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
Footer.propTypes = {
    // -------------------------------- redux:
    focusedDate: PropTypes.string,
    defaults: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        focusedDate: selectFocusedDate(state),
        defaults: selectDefaults(state),
        meta: selectMeta(state),
    };
};

export default connect(mapStateToProps)(Footer);
