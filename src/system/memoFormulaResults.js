import memoize from 'memoize-one';
import memoHistoryComputation from './memoHistoryComputation.js';
import evaluate from '../utils/evaluate.js';
import formatNumber from './formatNumber.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const memoFormulaResults = memoize((history, formulas) => {
    const {accountsBag} = memoHistoryComputation(history);

    const results = [];
    for (const {operations} of formulas) {
        let adaptedOperations = operations;
        for (const accountName in accountsBag) {
            const re = new RegExp('\\b' + accountName + '\\b', 'g');
            adaptedOperations = adaptedOperations.replace(re, accountsBag[accountName].total);
        }
        // console.log('operations:', operations);
        // console.log('adaptedOperations:', adaptedOperations);

        const result = evaluate(adaptedOperations);
        results.push(formatNumber(result));
    }

    return results;
});

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default memoFormulaResults;
