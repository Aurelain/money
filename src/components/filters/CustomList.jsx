import React from 'react';
import PropTypes from 'prop-types';
import {BOX_SHADOW, CONTENT_MAX_WIDTH} from '../../SETTINGS.js';
import Button from '../../ui/Button.jsx';
import embellishLabel from '../../system/embellishLabel.js';
import memo from '../../utils/memo.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        boxShadow: BOX_SHADOW,
        background: '#fffecf',
        position: 'absolute',
        overflow: 'auto',
        maxHeight: 300,
        width: '25%',
        maxWidth: CONTENT_MAX_WIDTH / 4,
        color: 'magenta',
    },
    btnNormal: {
        padding: 4,
        justifyContent: 'start',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontWeight: 500,
    },
    btnSelected: {
        background: '#1976d2',
        padding: 4,
        color: '#fff',
        justifyContent: 'start',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
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
    memoRootSx = memo();

    render() {
        const {items, onSelect, onHold, innerRef, selectedValue, preferredValue, meta, data, styling} = this.props;
        return (
            <div css={this.memoRootSx(SX.root, styling)} ref={innerRef}>
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
        let winnerIndex = -1;
        let maxSimilarity = -1;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const similarity = countSimilarStartingLetters(selectedValue, item);
            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                winnerIndex = i;
            }
        }
        if (winnerIndex < 0) {
            return;
        }
        const root = innerRef.current;
        const elements = root.childNodes;
        const winner = elements[winnerIndex];
        const {offsetTop, offsetHeight} = winner;
        let futureScrollTop = -1;
        if (offsetTop < root.scrollTop) {
            futureScrollTop = offsetTop;
        } else if (offsetTop + offsetHeight > root.scrollTop + root.offsetHeight) {
            futureScrollTop = root.scrollTop + root.offsetHeight - offsetHeight;
        }
        if (futureScrollTop >= 0) {
            root.scrollTop = futureScrollTop;
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
    styling: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default CustomList;
