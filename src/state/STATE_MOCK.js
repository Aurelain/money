// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const STATE_MOCK = {
    tokens: {
        accessToken: 'foo',
        refreshToken: 'foo',
        expirationTimestamp: 0,
    },
    vaults: {},
    importantAccounts: {},
    history: [],
    options: {
        defaults: {
            from: 'God',
            value: '100',
            to: 'Bar',
            product: 'Misc',
        },
        meta: {
            God: {
                alias: 'g',
                suffix: '🤡',
            },
            AIng: {
                alias: 'a',
                suffix: '🦁',
            },
        },
        formulas: [
            {
                label: '_MyTotal1',
                operations: 'AnaCard+Abigail', // -8500+1900=-6600
            },
            {
                label: 'MyTotal2',
                operations: 'Aiden-(Alexandru/2)', // 5800-(-2800/2)=5800+1400=7200
            },
        ],
    },
    optionsVaultId: '',
    report: 'from==="AnaCard" || to==="AnaCard"',
    isMenuOpen: false,
    volatile: {},
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default STATE_MOCK;
