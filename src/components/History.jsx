import memoize from 'memoize-one';
import React from 'react';
import {
    HEADER_HEIGHT,
    HEADER_SAFETY,
    FOOTER_SAFETY,
    FOOTER_HEIGHT,
    FILTER_HEIGHT,
    CONTENT_MAX_WIDTH,
} from '../SETTINGS.js';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {selectHistory, selectFocusedDate, selectMeta} from '../state/selectors.js';
import Row from './Row.jsx';
import Button from '../ui/Button.jsx';
import memoHistoryComputation from '../system/memoHistoryComputation.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX = {
    root: {
        paddingTop: HEADER_HEIGHT + HEADER_SAFETY + FILTER_HEIGHT,
        paddingBottom: FOOTER_HEIGHT + FOOTER_SAFETY + FILTER_HEIGHT + 64,
        margin: 'auto',
        maxWidth: CONTENT_MAX_WIDTH,
        display: 'flex',
        flexDirection: 'column',
    },
    more: {
        width: '25%',
        padding: 8,
        justifyContent: 'start',
    },
};

const ITEMS_PER_PAGE = 30;

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class History extends React.PureComponent {
    state = {
        pages: 1,
    };

    render() {
        const {history, focusedDate, meta} = this.props;
        const {pages} = this.state;
        const {hasMore, subset} = this.memoHistorySubset(history, pages);
        const {virtualDates} = memoHistoryComputation(history);
        return (
            <div css={SX.root}>
                {hasMore && <Button cssNormal={SX.more} label={'...'} onClick={this.onMoreClick} variant={'simple'} />}
                {subset.map((row) => {
                    const {date} = row;
                    return (
                        <Row
                            key={date}
                            {...row}
                            isSelected={focusedDate === date}
                            isVirtual={date in virtualDates}
                            meta={meta}
                        />
                    );
                })}
            </div>
        );
    }

    componentDidMount() {
        scrollToBottom();
        setTimeout(scrollToBottom, 100);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.history !== this.props.history) {
            scrollToBottom();
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    memoHistorySubset = memoize((history, pages) => {
        // Remove duplicates (by date):
        const encountered = {};
        const subset = [];
        for (const item of history) {
            if (!encountered[item.date]) {
                encountered[item.date] = true;
                subset.push(item);
            }
        }

        // Pagination:
        const {length} = subset;
        const tailLength = pages * ITEMS_PER_PAGE;
        if (tailLength < length) {
            return {hasMore: true, subset: subset.slice(length - tailLength)};
        }

        return {hasMore: false, subset};
    });

    /**
     *
     */
    onMoreClick = () => {
        this.setState({
            pages: this.state.pages + 1,
        });
    };
}

// =====================================================================================================================
//  H E L P E R S
// =====================================================================================================================
const scrollToBottom = () => {
    window.scrollTo(0, 999999);
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
History.propTypes = {
    // -------------------------------- redux:
    history: PropTypes.array.isRequired,
    focusedDate: PropTypes.string,
    meta: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    history: selectHistory(state),
    focusedDate: selectFocusedDate(state),
    meta: selectMeta(state),
});

export default connect(mapStateToProps)(History);
