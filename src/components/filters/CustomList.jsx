import React from 'react';
import PropTypes from 'prop-types';
import {BOX_SHADOW, CONTENT_MAX_WIDTH, SECONDARY_COLOR} from '../../SETTINGS.js';
import Button from '../../ui/Button.jsx';
import embellishLabel from '../../system/embellishLabel.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        boxShadow: BOX_SHADOW,
        background: SECONDARY_COLOR,
        position: 'absolute',
        overflow: 'auto',
        maxHeight: 300,
        width: '25%',
        maxWidth: CONTENT_MAX_WIDTH / 4,
    },
    btnNormal: {
        padding: 4,
        justifyContent: 'start',
    },
    btnSelected: {
        background: '#1976d2',
        padding: 4,
        color: '#fff',
        justifyContent: 'start',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class CustomList extends React.PureComponent {
    render() {
        const {items, onRelease, innerRef, selectedValue, preferredValue, meta} = this.props;
        return (
            <div css={SX.root} ref={innerRef}>
                {items.map((value) => {
                    const isSelected = value === selectedValue;
                    return (
                        <Button
                            key={value}
                            name={value}
                            variant={'simple'}
                            label={embellishLabel(value, preferredValue, meta)}
                            onRelease={onRelease}
                            cssNormal={isSelected ? SX.btnSelected : SX.btnNormal}
                        />
                    );
                })}
            </div>
        );
    }

    componentDidMount() {
        this.scrollToSelected();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedValue !== this.props.selectedValue) {
            this.scrollToSelected();
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    scrollToSelected = () => {
        console.log('scrollToSelected:');
    };
}

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
CustomList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    onRelease: PropTypes.func,
    innerRef: PropTypes.object.isRequired,
    selectedValue: PropTypes.string,
    preferredValue: PropTypes.string,
    meta: PropTypes.object.isRequired,
};

export default CustomList;
