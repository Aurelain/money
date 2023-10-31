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
import {selectDefaults, selectFocusedDate, selectHistory, selectMeta} from '../state/selectors.js';
import memo from '../utils/memo.js';
import Close from '../ui/Icons/Close.jsx';
import clearFocusedDate from '../state/actions/clearFocusedDate.js';
import parseCommand from '../system/parseCommand.js';
import buildCommand from '../system/buildCommand.js';
import validateSelectors from '../system/validateSelectors.js';
import appendRow from '../state/actions/appendRow.js';
import memoHistoryComputation from '../system/memoHistoryComputation.js';
import deleteRow from '../state/actions/deleteRow.js';
import updateRow from '../state/actions/updateRow.js';
import Check from '../ui/Icons/Check.jsx';
import toggleFavorite from '../state/actions/toggleFavorite.js';

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
        right: 84,
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
    digestion; // filled by `memoDigestion`, contains `{from, value, to, product}`
    state = {
        command: '',
    };

    render() {
        const {focusedDate, defaults, meta, history} = this.props;
        const {command} = this.state;
        const {from, value, to, product} = this.memoDigestion(command, defaults, meta);
        const isValid = this.memoIsValid(command, this.digestion, history);
        return (
            <div css={SX.root}>
                <div css={SX.content}>
                    <SelectFrom onSelect={this.onSelectorSelect} onHold={this.onSelectorHold} label={from} />
                    <SelectValue onSelect={this.onSelectorSelect} onHold={this.onSelectorHold} label={value} />
                    <SelectTo onSelect={this.onSelectorSelect} onHold={this.onSelectorHold} label={to} />
                    <SelectProduct onSelect={this.onSelectorSelect} onHold={this.onSelectorHold} label={product} />
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
                            icon={focusedDate ? Check : Plus}
                            cssNormal={SX.plus}
                            variant={'inverted'}
                            onClick={this.onPlusClick}
                            disabled={!isValid}
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
                gsap.killTweensOf(this.focusedRef.current);
                gsap.fromTo(this.focusedRef.current, {opacity: 1}, {opacity: 0, delay: 0.5});
                const focusedRow = this.props.history.find((item) => item.date === focusedDate);
                this.setState({
                    command: buildCommand(focusedRow),
                });
            } else {
                defocus();
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
        this.setState({command: ''});
        if (focusedDate) {
            clearFocusedDate();
            updateRow(focusedDate, command);
        } else {
            appendRow(command);
        }
    };

    /**
     *
     */
    onSelectorSelect = ({name, data: category}) => {
        this.applyDigestion(category, name);
    };

    /**
     *
     */
    onSelectorHold = ({name, data: category}) => {
        this.applyDigestion(category, name);
        toggleFavorite(category, name);
    };

    /**
     *
     */
    applyDigestion = (digestionProp, digestionValue) => {
        const freshDigestion = {...this.digestion, [digestionProp]: digestionValue};
        this.setState({
            command: buildCommand(freshDigestion),
        });
    };

    /**
     *
     */
    onTrashClick = () => {
        const {focusedDate} = this.props;
        deleteRow(focusedDate);
    };

    /**
     *
     */
    onCloseClick = () => {
        clearFocusedDate();
    };

    /**
     *
     */
    memoDigestion = memoize((command, defaults, meta) => {
        this.digestion = parseCommand({command, defaults, meta}); // harmless side-effect
        return this.digestion;
    });

    /**
     *
     */
    memoIsValid = memoize((command, digestion, history) => {
        if (!command || !validateSelectors(digestion)) {
            return false;
        }
        const {accountsBag} = memoHistoryComputation(history);
        return digestion.from in accountsBag || digestion.to in accountsBag;
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
    history: PropTypes.array,
    defaults: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        focusedDate: selectFocusedDate(state),
        history: selectHistory(state),
        defaults: selectDefaults(state),
        meta: selectMeta(state),
    };
};

export default connect(mapStateToProps)(Footer);
