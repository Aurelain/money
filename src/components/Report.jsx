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
import Select from '../ui/Select.jsx';
import toggleTag from '../state/actions/toggleTag.js';
import ReportNumber from './ReportNumber.jsx';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const TEMPORARY_GLOBAL_PROPERTY = '_collectReportEntries';
const SX = {
    root: {
        padding: 16,
        paddingTop: HEADER_HEIGHT + HEADER_SAFETY,
        paddingBottom: FOOTER_HEIGHT + FOOTER_SAFETY,
        '& li': {
            width: 200,
            margin: 4,
            borderBottom: 'solid 1px silver',
        },
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
        marginBottom: 32,
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
    select: {},
};

const LIST_PROPS = {
    items: [
        {
            name: 'c_Mâncare',
            label: 'Mâncare',
        },
        {
            name: 'c_Casnice',
            label: 'Casnice',
        },
        {
            name: 'c_Utilități',
            label: 'Utilități',
        },
        {
            name: 'c_Educație',
            label: 'Educație',
        },
        {
            name: 'c_Distracție',
            label: 'Distracție',
        },
        {
            name: 'c_Transport',
            label: 'Transport',
        },
        {
            name: 'c_Rezerve',
            label: 'Rezerve',
        },
        {
            name: 'c_Stingeri',
            label: 'Stingeri',
        },
        {
            name: 'c_Neprevăzute',
            label: 'Neprevăzute',
        },
        {
            name: 'c_Discuție',
            label: 'Discuție',
        },
    ],
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
        const categories = computeCategories(entries, LIST_PROPS.items);
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
                                    <td>
                                        <Select
                                            cssNormal={SX.select}
                                            variant={'simple'}
                                            label={product}
                                            listProps={LIST_PROPS}
                                            data={date}
                                            onSelect={this.onSummarySelect}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {!!targets.length && (
                    <>
                        Money:
                        <ul>
                            <li>
                                Money In: <ReportNumber value={totals.moneyIn} />
                            </li>
                            <li>
                                Money Out: <ReportNumber value={totals.moneyOut} />
                            </li>
                            <li>
                                Money Delta: <ReportNumber value={totals.moneyIn - totals.moneyOut} />
                            </li>
                        </ul>
                        Credits:
                        <ul>
                            <li>
                                Credits Good: <ReportNumber value={totals.creditsGood} />
                            </li>
                            <li>
                                Credits Bad: <ReportNumber value={totals.creditsBad} />
                            </li>
                            <li>
                                Credits Delta: <ReportNumber value={totals.creditsGood - totals.creditsBad} />
                            </li>
                        </ul>
                    </>
                )}
                Categories:
                <ul>
                    {LIST_PROPS.items.map((item) => {
                        return (
                            <li key={item.label}>
                                {item.label}: <ReportNumber value={categories[item.name]} />
                            </li>
                        );
                    })}
                    <li>
                        TOTAL: <ReportNumber value={categories.total} />
                    </li>
                </ul>
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

    onSummarySelect = ({data, name}) => {
        toggleTag(data, name);
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
    let moneyIn = 0;
    let moneyOut = 0;
    let creditsGood = 0;
    let creditsBad = 0;
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
                creditsGood += value;
            } else {
                moneyOut += value;
            }
        } else if (!isFrom && isTo) {
            if (isCredit) {
                creditsBad += value;
            } else {
                moneyIn += value;
            }
        }
    }

    return {
        moneyIn,
        moneyOut,
        creditsGood,
        creditsBad,
    };
};

/**
 *
 */
const computeCategories = (entries, list) => {
    const categories = {
        total: 0,
    };
    for (const item of list) {
        categories[item.name] = 0;
    }
    for (const entry of entries) {
        const {value, product} = entry;
        for (const item of list) {
            if (product.includes(item.name)) {
                categories[item.name] += value;
                categories.total += value;
            }
        }
    }
    return categories;
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
