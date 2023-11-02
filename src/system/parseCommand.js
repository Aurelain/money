import memoize from 'memoize-one';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 * We're memoizing it because the command is centralized.
 */
const parseCommand = memoize((command, defaults, meta) => {
    let {from, value, to, product} = defaults;

    command = command.replace(/\s+/g, ' ');
    command = ' ' + command + ' '; // pad with space to help with matches. Avoid `\b` because of diacritics.

    for (const keyword in meta) {
        const {alias} = meta[keyword];
        if (alias) {
            const re = new RegExp(' ' + alias + ' ', 'gi');
            command = command.replace(re, ' ' + keyword + ' ');
        }
    }

    command = command.replace(/ \S/g, (found) => found.toLocaleUpperCase());
    command = command.trim();

    const parts = command.split(' ');
    if (parts[0].match(/^\d+$/)) {
        // Starts with a number
        parts.unshift(from);
    }

    const [f, v, t, ...other] = parts;
    from = f || from;
    value = v || value;
    to = t || to;
    product = other.join(' ') || product;

    return {from, value, to, product};
});

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default parseCommand;
