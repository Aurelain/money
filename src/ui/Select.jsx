import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {createPortal} from 'react-dom';
import Button from './Button.jsx';
import List from './List.jsx';
import getScrollBarWidth from '../utils/getScrollBarWidth.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        touchAction: 'none', // to prevent scrolling on mobile
        pointerEvents: 'none',
        '&>*': {
            pointerEvents: 'auto',
        },
    },
    fog: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    list: {
        position: 'absolute',
        overflow: 'auto',
        maxHeight: 300,
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Select extends React.PureComponent {
    buttonRef = React.createRef();
    listRef = React.createRef();
    state = {
        isOpen: false,
    };

    render() {
        const {button, list, listProps, forcedOpen, data, tenacious, ...other} = this.props;
        const {isOpen} = this.state;
        const ButtonClass = typeof button === 'function' ? button : Button;
        const ListClass = typeof list === 'function' ? list : List;
        const finalListProps = this.memoListProps(listProps);
        return (
            <>
                {/*TODO use press for quick selection*/}
                <ButtonClass {...other} data={data} onClick={this.onButtonClick} innerRef={this.buttonRef} />
                {(isOpen || forcedOpen) &&
                    createPortal(
                        <div css={SX.overlay}>
                            {!tenacious && <div css={SX.fog} onClick={this.onFogClick} />}
                            <ListClass
                                {...finalListProps}
                                onSelect={this.onListSelect}
                                innerRef={this.listRef}
                                data={data}
                            />
                        </div>,
                        document.body,
                    )}
            </>
        );
    }

    componentDidMount() {
        if (this.props.forcedOpen) {
            this.refreshListPosition();
        }
    }

    componentDidUpdate() {
        if (this.state.isOpen || this.props.forcedOpen) {
            this.refreshListPosition();
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    onButtonClick = () => {
        this.setState({isOpen: true});
        this.props.onOpen?.();
    };

    /**
     *
     */
    onFogClick = () => {
        this.setState({isOpen: false});
    };

    /**
     *
     */
    onListSelect = (payload) => {
        const {tenacious, onSelect} = this.props;
        if (!tenacious) {
            this.setState({isOpen: false});
        }
        onSelect(payload);
    };

    /**
     *
     */
    refreshListPosition = () => {
        const list = this.listRef.current;
        const buttonBounds = this.buttonRef.current.getBoundingClientRect();
        const listBounds = list.getBoundingClientRect();
        const windowWidth = window.innerWidth - getScrollBarWidth();

        let left = buttonBounds.left;
        if (left + listBounds.width > windowWidth) {
            left = windowWidth - listBounds.width;
        }

        let top = buttonBounds.top + buttonBounds.height;
        if (top + listBounds.height > window.innerHeight - 30) {
            top = buttonBounds.top - listBounds.height;
        }

        list.style.left = left + 'px';
        list.style.top = top + 'px';
    };

    /**
     *
     */
    memoListProps = memoize((listProps) => {
        const output = {};
        Object.assign(output, listProps);
        if (output.styling) {
            output.styling = [SX.list, output.styling];
        } else {
            output.styling = SX.list;
        }
        return output;
    });
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
Select.propTypes = {
    button: PropTypes.elementType,
    buttonProps: PropTypes.object,
    list: PropTypes.elementType,
    listProps: PropTypes.object,
    onOpen: PropTypes.func,
    onSelect: PropTypes.func,
    forcedOpen: PropTypes.bool,
    tenacious: PropTypes.bool,
    data: PropTypes.any,
};

export default Select;
