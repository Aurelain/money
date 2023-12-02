import React from 'react';
import {CREDIT_KEYWORD, FOOTER_HEIGHT, FOOTER_SAFETY, HEADER_HEIGHT, HEADER_SAFETY} from '../SETTINGS.js';
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
        fontFamily: 'inherit',
        fontSize: 'inherit',
        overflow: 'hidden',
        height: 64,
        marginBottom: 32,
    },
    table: {
        '& *': {
            userSelect: 'text',
        },
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        '& th, & td': {
            textAlign: 'left',
            padding: 2,
            border: 'solid 1px silver',
            width: '20%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
        },
    },
    targeted: {
        fontWeight: 'bold',
    },
    good: {
        background: 'rgba(0,255,0,0.1)',
    },
    bad: {
        background: 'rgba(255,0,0,0.1)',
    },
};

// =====================================================================================================================
//  C O M P O N E N T
// =====================================================================================================================
class Report extends React.PureComponent {
    render() {
        const {history, report} = this.props;
        const entries = collectReportEntries(history, report);
        const targets = inferTargets(report);
        const totals = targets && computeTotals(entries, targets);
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
                            const {from, to, date, product, value} = entry;
                            return (
                                <tr key={index} css={decideCss(from, to, targets)}>
                                    <td>{beautifyDate(date)}</td>
                                    <td css={targets.includes(from) && SX.targeted}>{from}</td>
                                    <td>{value}</td>
                                    <td css={targets.includes(to) && SX.targeted}>{to}</td>
                                    <td>{product}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {!!targets.length && (
                    <>
                        <h4>Expenditures: {totals.expenditures}</h4>
                        <h4>Credits: {totals.credits}</h4>
                        <h2>Worth: {totals.worth}</h2>
                    </>
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
const inferTargets = (report) => {
    let target;

    target = report.match(/(\[.*?]).includes/)?.[1];
    if (target) {
        return JSON.parse(target);
    }

    target = report.match(/from\s*==+\s*"(.*?)"/)?.[1];
    if (target) {
        return [target];
    }

    target = report.match(/to\s*==+\s*"(.*?)"/)?.[1];
    if (target) {
        return [target];
    }

    return [];
};

/**
 *
 */
const beautifyDate = (date) => {
    const matched = date.match(/^\d\d(\d\d-\d\d-\d\d)T(\d\d:\d\d)/);
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
const computeTotals = (entries, targets) => {
    let expenditures = 0;
    let credits = 0;
    for (const entry of entries) {
        const {from, to, value, product} = entry;
        const isCredit = product.includes(CREDIT_KEYWORD);
        let isFrom;
        let isTo;
        for (const target of targets) {
            if (target === from) {
                isFrom = true;
            }
            if (target === to) {
                isTo = true;
            }
        }
        if (isFrom && !isTo) {
            if (isCredit) {
                credits -= value;
            } else {
                expenditures -= value;
            }
        } else if (!isFrom && isTo) {
            if (isCredit) {
                credits += value;
            } else {
                expenditures += value;
            }
        }
    }

    return {
        expenditures,
        credits,
        worth: expenditures - credits,
    };
};

/**
 *
 */
const decideCss = (from, to, targets) => {
    let isFrom;
    let isTo;
    for (const target of targets) {
        if (target === from) {
            isFrom = true;
        }
        if (target === to) {
            isTo = true;
        }
    }
    if (isFrom && !isTo) {
        return SX.bad;
    } else if (!isFrom && isTo) {
        return SX.good;
    }

    return null;
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
