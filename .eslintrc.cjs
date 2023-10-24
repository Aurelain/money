module.exports = {
    root: true,
    env: {
        browser: true,
        es2020: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    ignorePatterns: ['docs', '.eslintrc.cjs'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    settings: {
        react: {
            version: '18.2',
        },
    },
    rules: {
        'max-len': [
            'warn',
            {
                code: 120,
            },
        ],
        // Allow `while (true)`:
        'no-constant-condition': [
            'error',
            {
                checkLoops: false,
            },
        ],
        // Allow `<div css={}>`:
        'react/no-unknown-property': [
            'error',
            {
                ignore: ['css'],
            },
        ],
        quotes: ['warn', 'single', 'avoid-escape'],
    },
};
