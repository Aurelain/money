import {getState} from '../store.js';
import {selectHistory} from '../selectors.js';
import {CREDIT_KEYWORD} from '../../SETTINGS.js';
import memoHistoryComputation from '../../system/memoHistoryComputation.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const showDebts = () => {
    const state = getState();
    const history = selectHistory(state);
    const {accountsBag, virtualAccounts} = memoHistoryComputation(history);

    const relations = {};
    for (const item of history) {
        const {from, value, to, product} = item;
        const isVirtual = virtualAccounts[from] || virtualAccounts[to];
        if (isVirtual || product.includes(CREDIT_KEYWORD)) {
            const fromOwner = accountsBag[from].owner;
            const toOwner = accountsBag[to].owner;
            const relationName = [fromOwner, toOwner].sort().join('_');
            relations[relationName] = relations[relationName] || {
                [fromOwner]: 0,
                [toOwner]: 0,
            };
            relations[relationName][fromOwner] -= value;
            relations[relationName][toOwner] += value;
        }
    }

    const lines = [];
    for (const key in relations) {
        const relation = relations[key];
        const [actor1, actor2] = Object.keys(relation);
        const value = relation[actor1];
        if (value) {
            const creditor = value < 0 ? actor1 : actor2;
            const debtor = value < 0 ? actor2 : actor1;
            lines.push(`${debtor} must pay ${value} to ${creditor}!`);
        }
    }
    const summary = lines.length ? lines.join('\n') : 'No debt!';
    alert(summary);
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default showDebts;
