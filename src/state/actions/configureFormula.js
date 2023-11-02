import {getState, setState} from '../store.js';
import saveOptions from '../../system/saveOptions.js';
import condense from '../../utils/condense.js';
import {selectFormulas} from '../selectors.js';
import assume from '../../utils/assume.js';
import evaluate from '../../utils/evaluate.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const configureFormula = async (index = undefined) => {
    const suggestion = getPromptSuggestion(index);
    const reply = prompt('Formula syntax: label = account + account', suggestion);
    if (reply === null) {
        // The user pressed `Cancel`
        return;
    }

    if (reply === suggestion) {
        // The user pressed `OK` without changing anything
        return;
    }

    const formula = parseFormulaText(reply);

    setState((state) => {
        const formulas = selectFormulas(state);
        if (index === undefined) {
            // This is a creation
            formulas.push(formula);
        } else {
            // This is an update or a deletion
            if (formula) {
                // This is an update
                formulas.splice(index, 1, formula);
            } else {
                // This is a deletion
                formulas.splice(index, 1);
            }
        }
    });

    await saveOptions();
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const getPromptSuggestion = (index) => {
    if (index === undefined) {
        return '';
    }

    const state = getState();
    const formulas = selectFormulas(state);
    const {label, operations} = formulas[index];
    return `${label} = ${operations}`;
};

/**
 *
 */
const parseFormulaText = (command) => {
    if (!command) {
        return null;
    }

    let [, label, operations] = command.match(/(.*?)=(.*)/) || ['', '', ''];

    label = condense(label);
    assume(label.match(/^\w+$/i), 'Invalid label in formula!');

    operations = condense(operations);
    const draftOperations = operations.replace(/\b\w+\b/g, '3');
    const testValue = evaluate(draftOperations);
    assume(typeof testValue === 'number', 'Invalid operations in formula!');

    return {label, operations};
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default configureFormula;
