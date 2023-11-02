export const USE_MOCK = Boolean(window.location.href.match(/\d/)) || window.localStorage.MOCK === 'yes';
window.USE_MOCK = USE_MOCK; // for the benefit of `requestJson()`

export const STORE_KEY = 'money-store'; // the name in IndexedDB
export const PRIMARY_COLOR = '#ec6f24';
export const SECONDARY_COLOR = '#fff59d';
export const BOX_SHADOW = `
    0px 3px 1px -2px rgba(0,0,0,0.2),
    0px 2px 2px 0px rgba(0,0,0,0.14),
    0px 1px 5px 0px rgba(0,0,0,0.12)`.replace(/\s+/g, ' ');

export const CONTENT_MAX_WIDTH = 768;
export const HEADER_HEIGHT = 60;
export const HEADER_SAFETY = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat')) || 0;
export const FOOTER_HEIGHT = 48;
export const FOOTER_SAFETY = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0;
export const FILTER_HEIGHT = 32;

export const VAULT_PREFIX = 'Money_';
export const VAULT_OPTIONS = VAULT_PREFIX + 'Options';

export const PATTERN_ONLY_CHARACTERS = /^\S+$/;

export const FIELD_FROM = 'from';
export const FIELD_VALUE = 'value';
export const FIELD_TO = 'to';
export const FIELD_PRODUCT = 'product';

export const CREDIT_KEYWORD = 'Credit';
export const VIRTUAL_KEYWORD = 'CreditV';
export const CREDIT_CARD_MARK = 'CC';

// The following values have been obtained through `btoa('actual_value')`. Funny security, right?
// prettier-ignore
// eslint-disable-next-line max-len
export const GOOGLE_CLIENT_ID = atob('ODcyNjI3MzY3MDM0LWo4M3MwN3QxY2U3MXY0N2tvaWsycGU2ZTd0bmk5N2xzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t');
export const GOOGLE_CLIENT_SECRET = atob('R09DU1BYLXZJR3dpWnI5MXhOSUtrVzRnNGp3LVRKYTE3SlQ=');
