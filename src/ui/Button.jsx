import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import checkParents from '../utils/checkParents.js';
import {BOX_SHADOW} from '../SETTINGS.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        minWidth: 24,
        minHeight: 24,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        lineHeight: 1.5,
        // touchAction: 'none', // so dragging/scrolling doesn't mess with us
        cursor: 'pointer',
        padding: 2,
        transitionProperty: 'background-color,color',
        transitionDuration: '250ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        '& > *': {
            flexShrink: 0, // so the icons don't resize when the label is nowrap
        },
    },
    disabled: {
        pointerEvents: 'none',
        cursor: 'pointer',
        boxShadow: 'none',
        opacity: 0.5,
    },

    // Variant `simple`:
    simple_normal: {
        // no special styles
    },
    simple_hover: {
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
        color: '#1976d2',
    },
    simple_active: {
        backgroundColor: 'rgba(25, 118, 210, 0.14)',
    },

    // Variant `inverted`:
    inverted_normal: {
        color: '#fff',
    },
    inverted_hover: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        color: 'yellow',
    },
    inverted_active: {
        backgroundColor: 'rgba(0, 0, 0, 0.14)',
    },

    // Variant `contained`:
    contained_normal: {
        borderRadius: 4,
        color: '#fff',
        backgroundColor: '#1976d2',
        padding: '6px 16px',
        boxShadow: BOX_SHADOW,
    },
    contained_hover: {
        filter: 'brightness(1.20)',
    },
    contained_active: {
        filter: 'brightness(0.8)',
        boxShadow: 'none',
    },

    isHolding: {
        background: '#f5c045',
        filter: 'brightness(1)',
    },
};
const HOLD_TIMEOUT = 500; // milliseconds
const HOLD_TOLERANCE = 10; // pixels
const CLICK_TIMEOUT = 50; // milliseconds
const RELEASE_TIMEOUT = 50; // milliseconds

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Button extends React.PureComponent {
    state = {
        isHovering: false,
        isPressing: false,
        isHolding: false,
    };
    rootRef = React.createRef();
    holdTimeout;
    clickTimeout;
    clickParams;
    releaseTimeout;
    initialX;
    initialY;

    render() {
        const {label, icon, holdIcon, cssNormal, cssHover, cssActive, variant, disabled, innerRef, ...otherProps} =
            this.props;
        delete otherProps.onHold;
        delete otherProps.onHoldStart;
        delete otherProps.onHoldCancel;
        delete otherProps.onClick;
        delete otherProps.onPress;
        delete otherProps.onRelease;
        const {isHovering, isPressing, isHolding} = this.state;
        const ref = innerRef || this.rootRef;
        const iconInstance = this.memoIcon(icon, holdIcon, isHolding);
        return (
            <div
                {...otherProps}
                ref={ref}
                css={[
                    SX.root,

                    SX[variant + '_normal'],
                    cssNormal,

                    isHovering && SX[variant + '_hover'],
                    isHovering && cssHover,

                    isHovering && isPressing && SX[variant + '_active'],
                    isHovering && isPressing && cssActive,

                    disabled && SX.disabled,

                    isHolding && SX.isHolding,
                ]}
                onPointerEnter={this.onRootPointerEnter}
                onPointerLeave={this.onRootPointerLeave}
                onPointerDown={this.onRootPointerDown}
                onContextMenu={this.onRootContextMenu}
                onClick={this.onRootClick}
                onPointerUp={this.onRootRelease}
                onTouchEnd={this.onRootRelease}
                role={'button'}
            >
                {iconInstance}
                {iconInstance && label && ' '}
                {this.memoContent(label)}
            </div>
        );
    }

    componentDidUpdate() {
        const {isHovering, isPressing, isHolding} = this.state;
        if (this.props.disabled && (isHovering || isPressing || isHolding)) {
            this.cancelInteractivity();
            this.setState({
                isHovering: false,
                isPressing: false,
                isHolding: false,
            });
        }
    }

    componentWillUnmount() {
        this.cancelInteractivity();
    }

    // -----------------------------------------------------------------------------------------------------------------
    // I N T E R N A L
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    memoContent = memoize((label) => {
        if (typeof label === 'function') {
            const Icon = label;
            return <Icon />;
        } else {
            return label;
        }
    });

    /**
     *
     */
    memoIcon = memoize((icon, holdIcon, isHolding) => {
        icon = isHolding && holdIcon ? holdIcon : icon;
        if (!icon) {
            return undefined;
        }
        if (typeof icon === 'function') {
            const Icon = icon;
            return <Icon />;
        } else {
            return icon;
        }
    });

    /**
     *
     */
    onRootPointerEnter = () => {
        this.setState({isHovering: true});
    };

    /**
     *
     */
    onRootPointerLeave = () => {
        this.setState({isHovering: false});
    };

    /**
     *
     */
    onRootPointerDown = (event) => {
        const {onPress, name, data} = this.props;
        const payload = {event, name, data};
        onPress?.(payload);

        this.setState({isPressing: true});
        window.addEventListener('pointerup', this.onWindowRelease);
        window.addEventListener('touchend', this.onWindowRelease);
        window.addEventListener('scroll', this.onWindowScrollWhilePressing);
        if (this.props.onHold) {
            this.initialX = event.clientX;
            this.initialY = event.clientY;
            this.holdTimeout = setTimeout(this.onHoldTimeout, HOLD_TIMEOUT);
            window.addEventListener('pointermove', this.onWindowMotion);
            window.addEventListener('touchmove', this.onWindowMotion);
        }
    };

    /**
     * Note: This handles both `pointermove` and `touchmove` because of the anomalies of `touch-action`.
     */
    onWindowMotion = (event) => {
        const {clientX, clientY} = getCoordinatesFromEvent(event);
        const deltaX = Math.abs(clientX - this.initialX);
        const deltaY = Math.abs(clientY - this.initialY);
        if (deltaX > HOLD_TOLERANCE || deltaY > HOLD_TOLERANCE) {
            this.cancelHolding();
        }
    };

    /**
     * Note: This handles both `pointerup` and `touchend` because of the anomalies of `touch-action`.
     * Note: We're using this event, instead of click, to avoid some confusing behavior on mobile (context menu firing,
     * scroll stealing the click etc.).
     */
    onWindowRelease = (event) => {
        const {isHolding} = this.state;
        this.cancelHolding();
        this.cancelPressing();

        const target = getTargetFromEvent(event);
        const ref = this.props.innerRef || this.rootRef;
        if (!checkParents(target, ref.current)) {
            // The user released the pointer somewhere outside the button, so no click
            return;
        }

        if (checkButtonInButton(target, ref.current)) {
            // The user clicked on a button that is a child of ours. That button should have priority.
            return;
        }

        // We have to delay the announcement of the click a bit to avoid the secondary release event triggering another
        // click in other things (for example, maybe an overlay which appears after our click).
        // TODO: investigate if this delay would cause problems for audio activation
        this.clickTimeout = setTimeout(this.onClickTimeout, CLICK_TIMEOUT);
        this.clickParams = {event, isHolding};
    };

    /**
     *
     */
    onClickTimeout = () => {
        const {onClick, onHold, name, data} = this.props;
        const {isHolding, event} = this.clickParams;
        this.clickParams = null;
        const payload = {event, name, data};
        if (isHolding) {
            onHold(payload);
        } else {
            onClick?.(payload);
        }
    };

    /**
     *
     */
    onHoldTimeout = () => {
        this.setState({
            isHolding: true,
        });
        this.props.onHoldStart?.();
    };

    /**
     *
     */
    onWindowScrollWhilePressing = () => {
        this.setState({isHovering: false});
        this.cancelHolding();
        this.cancelPressing();
    };

    /**
     *
     */
    cancelHolding = () => {
        const {isHolding} = this.state;
        clearTimeout(this.holdTimeout);
        window.removeEventListener('pointermove', this.onWindowMotion);
        window.removeEventListener('touchmove', this.onWindowMotion);
        if (isHolding) {
            this.setState({isHolding: false});
            this.props.onHoldCancel?.();
        }
    };

    /**
     *
     */
    cancelPressing = () => {
        this.setState({isPressing: false});
        window.removeEventListener('pointerup', this.onWindowRelease);
        window.removeEventListener('touchend', this.onWindowRelease);
        window.removeEventListener('scroll', this.onWindowScrollWhilePressing);
    };

    /**
     *
     */
    onRootContextMenu = (event) => {
        event.preventDefault();
    };

    /**
     *
     */
    onRootClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    /**
     *
     */
    onRootRelease = () => {
        if (this.props.onRelease) {
            clearTimeout(this.releaseTimeout);
            this.releaseTimeout = setTimeout(this.onReleaseTimeout, RELEASE_TIMEOUT);
        }
    };

    /**
     *
     */
    onReleaseTimeout = () => {
        const {onRelease, name, data} = this.props;
        const payload = {name, data};
        onRelease(payload);
    };

    /**
     *
     */
    cancelInteractivity = () => {
        this.cancelHolding();
        this.cancelPressing();
        clearTimeout(this.releaseTimeout);
        clearTimeout(this.clickTimeout);
        this.clickParams = null;
    };
}

// =====================================================================================================================
//  H E L P E R S
// =====================================================================================================================
/**
 *
 */
const getCoordinatesFromEvent = (event) => {
    event = event.changedTouches?.[0] || event;
    const {clientX, clientY} = event;
    return {clientX, clientY};
};

/**
 *
 */
const getTargetFromEvent = (event) => {
    const {clientX, clientY} = getCoordinatesFromEvent(event);
    return document.elementFromPoint(clientX, clientY);
};

/**
 *
 */
const checkButtonInButton = (child, topButton) => {
    let target = child;
    while (target !== topButton) {
        if (target.getAttribute('role') === 'button') {
            return true;
        }
        target = target.parentNode;
    }
    return false;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
Button.defaultProps = {
    variant: 'contained',
};
Button.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.node]),
    icon: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.bool]),
    holdIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.bool]),
    variant: PropTypes.oneOf(['simple', 'inverted', 'contained']),
    disabled: PropTypes.bool,
    name: PropTypes.string,
    cssNormal: PropTypes.any, // TODO: rename to `css`
    cssHover: PropTypes.any,
    cssActive: PropTypes.any,
    onClick: PropTypes.func,
    onHold: PropTypes.func,
    onHoldStart: PropTypes.func,
    onHoldCancel: PropTypes.func,
    onPress: PropTypes.func,
    onRelease: PropTypes.func,
    innerRef: PropTypes.object,
    data: PropTypes.any,
};
export default Button;
