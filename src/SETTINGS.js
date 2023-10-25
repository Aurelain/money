export const USE_MOCK = Boolean(window.location.href.match(/\d/)) || window.localStorage.MOCK === 'yes';
window.USE_MOCK = USE_MOCK; // for the benefit of `requestJson()`

export const STORE_KEY = 'money-store'; // the name in IndexedDB
export const PRIMARY_COLOR = '#f5c045';
export const SECONDARY_COLOR = '#fff59d';
export const BOX_SHADOW = `
    0px 3px 1px -2px rgba(0,0,0,0.2),
    0px 2px 2px 0px rgba(0,0,0,0.14),
    0px 1px 5px 0px rgba(0,0,0,0.12)`.replace(/\s+/g, ' ');

export const CONTENT_MAX_WIDTH = 768;
export const HEADER_HEIGHT = 60;
export const HEADER_SAFETY = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat')) || 0;
export const GRID_HEADER_HEIGHT = 32;
export const FOOTER_HEIGHT = 48;
export const FOOTER_SAFETY = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0;
export const FILTER_HEIGHT = 32;

export const VAULT_DIR_NAME = 'Money';
export const DATE_FORMAT = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\d/;

// The following values have been obtained through `btoa('actual_value')`. Funny security, right?
// prettier-ignore
// eslint-disable-next-line max-len
export const GOOGLE_CLIENT_ID = atob('ODcyNjI3MzY3MDM0LWo4M3MwN3QxY2U3MXY0N2tvaWsycGU2ZTd0bmk5N2xzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t');
export const GOOGLE_CLIENT_SECRET = atob('R09DU1BYLXZJR3dpWnI5MXhOSUtrVzRnNGp3LVRKYTE3SlQ=');
