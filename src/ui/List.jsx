import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button.jsx';
import memoize from 'memoize-one';
import {BOX_SHADOW} from '../SETTINGS.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRadius: 4,
        boxShadow: BOX_SHADOW,
    },
    item: {
        padding: 16,
        justifyContent: 'start',
        whiteSpace: 'nowrap',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class List extends React.PureComponent {
    render() {
        const {items, itemCss, onClick, onRelease, styling, innerRef} = this.props;
        const cssNormal = this.memoCssNormal(itemCss);
        return (
            <div css={[SX.root, styling]} ref={innerRef}>
                {items.map((item, index) => {
                    if (typeof item === 'function') {
                        const Component = item;
                        return <Component key={index} />;
                    } else if ('ref' in item) {
                        return item;
                    }

                    const {name, label, icon} = item;
                    return (
                        <Button
                            key={name}
                            name={name}
                            variant={'simple'}
                            label={label}
                            icon={icon}
                            onClick={onClick}
                            onRelease={onRelease}
                            cssNormal={cssNormal}
                        />
                    );
                })}
            </div>
        );
    }

    memoCssNormal = memoize((itemCss) => {
        return {...SX.item, ...itemCss};
    });
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
List.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.shape({
                name: PropTypes.string,
                label: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.node]),
                icon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
            }),
            PropTypes.func,
            PropTypes.node,
        ]),
    ),
    itemCss: PropTypes.object,
    onClick: PropTypes.func,
    onRelease: PropTypes.func,
    styling: PropTypes.oneOfType([PropTypes.array, PropTypes.object]), // TODO: rename to `css`
    innerRef: PropTypes.object,
};
export default List;
