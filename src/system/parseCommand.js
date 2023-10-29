// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const parseCommand = ({command, defaults, meta}) => {
    let {from, value, to, product} = defaults;

    for (const keyword in meta) {
        const {alias} = meta[keyword];
        const re = new RegExp('\\b' + alias + '\\b', 'gi');
        command = command.replace(re, keyword);
    }

    command = command.replace(/\s+/g, ' ');
    command = command.trim();
    command = command.replace(/\b\w/g, (found) => found.toLocaleUpperCase());

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
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default parseCommand;
