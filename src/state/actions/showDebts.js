import {getState} from '../store.js';
import {selectHistory, selectMeta} from '../selectors.js';
import {CREDIT_KEYWORD} from '../../SETTINGS.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const showDebts = () => {
    const state = getState();
    const history = selectHistory(state);
    const meta = selectMeta(state);

    const relations = {};
    for (const item of history) {
        const {from, value, to, product} = item;
        if (product.includes(CREDIT_KEYWORD)) {
            const fromOwner = meta[from]?.owner || from;
            const toOwner = meta[to]?.owner || to;
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
            const debtor = value < 0 ? actor2 : actor2;
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
