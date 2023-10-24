export const selectAccessToken = (state) => state.tokens.accessToken;
export const selectRefreshToken = (state) => state.tokens.refreshToken;
export const selectExpirationTimestamp = (state) => state.tokens.expirationTimestamp;
export const selectIsAuthenticated = (state) => state.volatile.isAuthenticated;
export const selectSpreadsheetIds = (state) => state.spreadsheetIds;
