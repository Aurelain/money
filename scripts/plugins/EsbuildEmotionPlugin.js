import fs from 'fs';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const SX_PATTERN = /const SX =[\s\S]*?;/;
const RULE_PATTERN = /([^\r\n]*):\s*{/g;

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const EsbuildEmotionPlugin = {
    name: 'EsbuildEmotionPlugin',
    setup(build) {
        const isDev = build.initialOptions.sourcemap;
        if (isDev) {
            build.onLoad({filter: /\.jsx$/}, async (args) => {
                const code = await fs.promises.readFile(args.path, 'utf8');
                const fileName = args.path.match(/[^\\/]*$/)[0];
                const stem = fileName.replace(/\.jsx$/, '');
                const sxMatch = code.match(SX_PATTERN);
                if (sxMatch) {
                    const sxWithLabels = sxMatch[0].replace(RULE_PATTERN, (found, ruleName) => {
                        const label = stem + '_' + ruleName.replace(/[^a-zA-Z0-9]/g, '');
                        return `${ruleName}:{label:'${label}',`;
                    });
                    return {
                        contents: code.replace(SX_PATTERN, sxWithLabels),
                        loader: 'jsx',
                    };
                }
            });
        }
    },
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default EsbuildEmotionPlugin;
