import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {createPortal} from 'react-dom';
import Button from './Button.jsx';
import List from './List.jsx';

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
        backgroundColor: 'rgba(0,0,0,0)',
        zIndex: 999999,
        touchAction: 'none', // to prevent scrolling on mobile
    },
    list: {
        position: 'absolute',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Select extends React.PureComponent {
    state = {
        isOpen: false,
    };
    buttonRef = React.createRef();
    listRef = React.createRef();

    render() {
        const {button, buttonProps, list, listProps, forcedOpen, onHold} = this.props;
        const {isOpen} = this.state;
        const ButtonClass = typeof button === 'function' ? button : Button;
        const ListClass = typeof list === 'function' ? list : List;
        const finalListProps = this.memoListProps(listProps);
        return (
            <>
                {/*TODO use press for quick selection*/}
                <ButtonClass {...buttonProps} onClick={this.onButtonClick} onHold={onHold} innerRef={this.buttonRef} />
                {(isOpen || forcedOpen) &&
                    createPortal(
                        <div css={SX.overlay} onClick={this.onOverlayClick}>
                            <ListClass {...finalListProps} onRelease={this.onListRelease} innerRef={this.listRef} />
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
        if (this.state.isOpen) {
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
    onOverlayClick = () => {
        this.setState({isOpen: false});
    };

    /**
     *
     */
    onListRelease = (payload) => {
        this.setState({isOpen: false});
        this.props.onSelect(payload);
    };

    /**
     *
     */
    refreshListPosition = () => {
        const list = this.listRef.current;
        const buttonBounds = this.buttonRef.current.getBoundingClientRect();
        const listBounds = list.getBoundingClientRect();
        const windowWidth = window.innerWidth - 20;

        let left = buttonBounds.left;
        if (left + listBounds.width > windowWidth) {
            left = windowWidth - listBounds.width;
        }

        let top = buttonBounds.top + buttonBounds.height;
        if (top + listBounds.height > window.innerHeight) {
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
    button: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    buttonProps: PropTypes.object,
    list: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    listProps: PropTypes.object,
    onOpen: PropTypes.func,
    onSelect: PropTypes.func,
    onHold: PropTypes.func,
    forcedOpen: PropTypes.bool,
};

export default Select;
