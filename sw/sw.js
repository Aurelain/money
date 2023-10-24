import './utils/interceptSwErrors.js';
import setupSw from './utils/setupSw.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const CACHED_PATHS = '@CACHED_PATHS'; // DO NOT EDIT MANUALLY! This is handled by the build script.
const IGNORED_FETCHES = [
    'googleapis', // https://oauth2.googleapis.com/token
    'google', // https://accounts.google.com/gsi/client
    'dot.png', // ./meta/dot.png
];

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const run = async () => {
    const version = JSON.stringify(CACHED_PATHS);
    await setupSw(version, {
        cachedPaths: CACHED_PATHS,
        ignoredFetches: IGNORED_FETCHES,
    });
};

// =====================================================================================================================
//  R U N
// =====================================================================================================================
run();
