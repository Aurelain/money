import React from 'react';
import {FOOTER_HEIGHT, FOOTER_SAFETY, HEADER_HEIGHT, HEADER_SAFETY} from '../SETTINGS.js';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {selectHistory, selectMeta, selectReport} from '../state/selectors.js';
import Button from '../ui/Button.jsx';
import Close from '../ui/Icons/Close.jsx';
import updateReport from '../state/actions/updateReport.js';
import defocus from '../utils/defocus.js';
import evaluate from '../utils/evaluate.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const TEMPORARY_GLOBAL_PROPERTY = '_collectReportEntries';
const SX = {
    root: {
        padding: 16,
        paddingTop: HEADER_HEIGHT + HEADER_SAFETY,
        paddingBottom: FOOTER_HEIGHT + FOOTER_SAFETY,
    },
    close: {
        float: 'right',
    },
    field: {
        width: '100%',
        borderRadius: 4,
        padding: 4,
        appearance: 'none',
        background: '#fff',
        resize: 'none',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        height: 32,
        marginBottom: 32,
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        '& th, & td': {
            textAlign: 'left',
            padding: 2,
            border: 'solid 1px silver',
            width: '20%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Report extends React.PureComponent {
    render() {
        const {history, report} = this.props;
        const entries = collectReportEntries(history, report);
        const target = inferTarget(report);
        return (
            <div css={SX.root}>
                <h1>
                    Report <Button cssNormal={SX.close} icon={Close} onClick={this.onCloseClick} />
                </h1>
                <textarea
                    ref={this.textareaRef}
                    autoComplete={'off'}
                    css={SX.field}
                    spellCheck={false}
                    value={report}
                    onChange={this.onFieldChange}
                    onKeyDown={this.onFieldKeyDown}
                />

                <table css={SX.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>From</th>
                            <th>Amount</th>
                            <th>To</th>
                            <th>Summary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => {
                            return (
                                <tr key={index}>
                                    <td>{beautifyDate(entry.date)}</td>
                                    <td>{entry.from}</td>
                                    <td>{entry.value}</td>
                                    <td>{entry.to}</td>
                                    <td>{entry.product}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {target && (
                    <h2>
                        Total for &quot;{target.value}&quot;: {computeTotal(entries, target)}
                    </h2>
                )}
            </div>
        );
    }

    // -----------------------------------------------------------------------------------------------------------------
    // P R I V A T E
    // -----------------------------------------------------------------------------------------------------------------
    onFieldChange = (event) => {
        const {value} = event.target;
        updateReport(value);
    };

    onFieldKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            defocus();
        } else if (event.key === 'Escape') {
            defocus();
        }
    };

    onCloseClick = () => {
        updateReport(null);
    };
}

// =====================================================================================================================
//  H E L P E R S
// =====================================================================================================================
/**
 *
 */
const inferTarget = (report) => {
    let target;

    target = report.match(/from.startsWith\("(.*?)"\)/)?.[1];
    if (target) {
        return {mode: 'fuzzy', value: target};
    }

    target = report.match(/to.startsWith\("(.*?)"\)/)?.[1];
    if (target) {
        return {mode: 'fuzzy', value: target};
    }

    target = report.match(/from\s*==+\s*"(.*?)"/)?.[1];
    if (target) {
        return {mode: 'exact', value: target};
    }

    target = report.match(/to\s*==+\s*"(.*?)"/)?.[1];
    if (target) {
        return {mode: 'exact', value: target};
    }

    return null;
};

/**
 *
 */
const beautifyDate = (date) => {
    const matched = date.match(/^(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d)/);
    return matched[1] + ', ' + matched[2];
};

/**
 *
 */
const collectReportEntries = (history, reportCommand) => {
    let safeCommand = reportCommand;

    // Also allow non-standard field names:
    safeCommand = safeCommand.replace(/\bamount\b/gi, 'value');
    safeCommand = safeCommand.replace(/\bsummary\b/gi, 'product');

    // Add `item` prefix:
    const prefix = 'window.' + TEMPORARY_GLOBAL_PROPERTY;
    safeCommand = safeCommand.replace(/\bdate\b/gi, prefix + '.date');
    safeCommand = safeCommand.replace(/\bfrom\b/gi, prefix + '.from');
    safeCommand = safeCommand.replace(/\bvalue\b/gi, prefix + 'value');
    safeCommand = safeCommand.replace(/\bto\b/gi, prefix + '.to');
    safeCommand = safeCommand.replace(/\bproduct\b/gi, prefix + '.product');

    // eslint-disable-next-line no-unused-vars
    const entries = history.filter((item) => {
        window[TEMPORARY_GLOBAL_PROPERTY] = item;
        const result = Boolean(evaluate(safeCommand));
        delete window[TEMPORARY_GLOBAL_PROPERTY];
        return result;
    });

    const uniqueDates = {};
    return entries.filter((item) => {
        if (uniqueDates[item.date]) {
            return false;
        } else {
            uniqueDates[item.date] = true;
            return true;
        }
    });
};

/**
 *
 */
const computeTotal = (entries, target) => {
    let total = 0;
    for (const {from, to, value} of entries) {
        let isFrom;
        let isTo;
        if (target.mode === 'fuzzy') {
            isFrom = from.startsWith(target.value);
            isTo = to.startsWith(target.value);
        } else {
            // Exact matching
            isFrom = from === target.value;
            isTo = to === target.value;
        }
        if (isFrom && !isTo) {
            total -= value;
        } else if (!isFrom && isTo) {
            total += value;
        }
    }

    return total;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
Report.propTypes = {
    // -------------------------------- redux:
    history: PropTypes.array.isRequired,
    meta: PropTypes.object.isRequired,
    report: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
    history: selectHistory(state),
    meta: selectMeta(state),
    report: selectReport(state),
});

export default connect(mapStateToProps)(Report);
