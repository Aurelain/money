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
    btnSelectedHover: {
        color: 'yellow',
        background: '#1976d2',
        filter: 'brightness(1.20)',
    },
    btnSelectedActive: {
        color: 'brown',
        background: '#1976d2',
        filter: 'brightness(0.8)',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class CustomList extends React.PureComponent {
    render() {
        const {items, onSelect, onHold, innerRef, selectedValue, preferredValue, meta, data} = this.props;
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
                            onClick={onSelect}
                            onHold={onHold}
                            cssNormal={isSelected ? SX.btnSelected : SX.btnNormal}
                            cssHover={isSelected ? SX.btnSelectedHover : undefined}
                            cssActive={isSelected ? SX.btnSelectedActive : undefined}
                            data={data}
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
        const {selectedValue, items, innerRef} = this.props;
        let winner = -1;
        let maxSimilarity = -1;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const similarity = countSimilarStartingLetters(selectedValue, item);
            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                winner = i;
            }
        }
        if (winner < 0) {
            return;
        }
        const root = innerRef.current;
        const elements = root.childNodes;
        const {offsetTop} = elements[winner];
        const idealScrollTop = offsetTop - root.offsetHeight / 2;
        const boundaryTop = root.scrollTop;
        const boundaryBottom = boundaryTop + root.offsetHeight;
        if (idealScrollTop < top || idealScrollTop > boundaryBottom) {
            root.scrollTop = idealScrollTop;
        }
    };
}

// =====================================================================================================================
//  H E L P E R S
// =====================================================================================================================
/**
 *
 */
const countSimilarStartingLetters = (primary, secondary) => {
    const length = Math.min(primary.length, secondary.length);
    for (let i = 0; i < length; i++) {
        if (primary.charAt(i) !== secondary.charAt(i)) {
            return i;
        }
    }
    return length;
};
// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
CustomList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelect: PropTypes.func,
    onHold: PropTypes.func,
    innerRef: PropTypes.object.isRequired,
    selectedValue: PropTypes.string,
    preferredValue: PropTypes.string,
    meta: PropTypes.object.isRequired,
    data: PropTypes.any,
};

export default CustomList;
