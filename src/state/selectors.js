export const selectAccessToken = (state) => state.tokens.accessToken;
export const selectRefreshToken = (state) => state.tokens.refreshToken;
export const selectExpirationTimestamp = (state) => state.tokens.expirationTimestamp;
export const selectIsAuthenticated = (state) => state.volatile.isAuthenticated;
export const selectIsHealed = (state) => state.volatile.isHealed;
export const selectVaults = (state) => state.vaults;
export const selectImportantAccounts = (state) => state.importantAccounts;
export const selectHistory = (state) => state.history;
export const selectFocusedDate = (state) => state.volatile.focusedDate;
export const selectOptions = (state) => state.options;
export const selectOptionsVaultId = (state) => state.optionsVaultId;
export const selectMeta = (state) => state.options.meta;
export const selectDefaults = (state) => state.options.defaults;
export const selectPreferredFrom = (state) => state.options.defaults.from;
export const selectPreferredValue = (state) => state.options.defaults.value;
export const selectPreferredTo = (state) => state.options.defaults.to;
export const selectPreferredProduct = (state) => state.options.defaults.product;
export const selectFormulas = (state) => state.options.formulas;
export const selectReport = (state) => state.report;
export const selectIsMenuOpen = (state) => state.isMenuOpen;
