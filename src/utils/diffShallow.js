import checkEmpty from './checkEmpty.js';

// =================================================================================================================
//  P U B L I C
// =================================================================================================================
/**
 *
 */
const diffShallow = (previous, next) => {
    const created = {};
    const updated = {};
    const deleted = {};
    const unchanged = {};

    for (const id in next) {
        if (id in previous) {
            if (previous[id] !== next[id]) {
                updated[id] = true;
            } else {
                unchanged[id] = true;
            }
        } else {
            created[id] = true;
        }
    }
    for (const id in previous) {
        if (!(id in next)) {
            deleted[id] = true;
        }
    }
    if (checkEmpty(created) && checkEmpty(updated) && checkEmpty(deleted)) {
        return null;
    }
    return {created, updated, deleted, unchanged};
};

// =================================================================================================================
//  E X P O R T
// =================================================================================================================
export default diffShallow;
