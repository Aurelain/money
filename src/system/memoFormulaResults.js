import memoize from 'memoize-one';
import memoHistoryComputation from './memoHistoryComputation.js';
import evaluate from '../utils/evaluate.js';
import formatNumber from './formatNumber.js';
import {PATTERN_WORTH} from '../SETTINGS.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const memoFormulaResults = memoize((history, formulas) => {
    const {accountsBag} = memoHistoryComputation(history);

    const results = [];
    for (const {label, operations} of formulas) {
        let adaptedOperations = operations;
        const isWorth = !!label.match(PATTERN_WORTH);

        for (const accountName in accountsBag) {
            const info = accountsBag[accountName];
            const re = new RegExp('\\b' + accountName + '\\b', 'g');
            const sum = isWorth ? info.worth : info.total;
            adaptedOperations = adaptedOperations.replace(re, sum);
        }

        const result = evaluate(adaptedOperations);
        // console.log(operations + ' → ' + adaptedOperations);
        // (typeof result !== 'number' || isNaN(result)) && console.warn(operations + ' → ' + adaptedOperations);
        results.push({
            label,
            result: formatNumber(result),
        });
    }

    return results;
});

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default memoFormulaResults;
