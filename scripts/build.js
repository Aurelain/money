import fs from 'fs';
import fsExtra from 'fs-extra';
import esbuild from 'esbuild';
import sendkeys from 'sendkeys-js';
import process from 'node:process';
import path from 'path';
import url from 'url';
import {hashElement} from 'folder-hash';
import findFiles from './utils/findFiles.js';
import EsbuildEmotionPlugin from './plugins/EsbuildEmotionPlugin.js';
import assume from './utils/assume.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const OUTPUT_DIR = 'docs';
const CLIENT_PATH_MARKER = '@CLIENT_PATH';
const CACHED_PATHS_MARKER = '@CACHED_PATHS';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const build = async () => {
    const time = Date.now();
    const isDev = process.argv.includes('--dev');
    const isFocus = process.argv.includes('--focus');

    // Build fresh:
    const entryPath = isFocus ? getFocusedPath() : 'src/main.jsx';
    fsExtra.emptyDirSync(OUTPUT_DIR);
    fsExtra.copySync('public', OUTPUT_DIR);
    const clientBundle = await createBundle(entryPath, 'js/[name]', isDev);

    // Rename `main.js`:
    const {hash} = await hashElement(OUTPUT_DIR);
    const cleanHash = hash.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
    renameClient(clientBundle, cleanHash);
    updateIndex(clientBundle);

    // Adapt service-worker:
    if (!isFocus) {
        const swBundle = await createBundle('sw/sw.js', '[name]', isDev);
        updateCachedPaths(swBundle);
        fs.writeFileSync(swBundle.filePath, swBundle.content);
    }

    // Write to disk the adapted main bundle:
    fs.writeFileSync(clientBundle.filePath, clientBundle.content);

    console.log(`Done in ${Date.now() - time} ms.`);
    await refreshBrowser();
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const createBundle = async (target, outputPattern, isDev) => {
    await esbuild.build({
        entryPoints: [target],
        bundle: true,
        minify: !isDev,
        sourcemap: isDev,
        outdir: OUTPUT_DIR,
        entryNames: outputPattern,
        // logLevel: 'info',
        legalComments: 'none',
        jsx: 'automatic', // this option, along with the next one, allow us to avoid using the jsx emotion pragma
        jsxImportSource: '@emotion/react',
        plugins: [EsbuildEmotionPlugin],
    });

    const filePath = getOutputFilePath(outputPattern);
    return {
        filePath,
        content: fs.readFileSync(filePath, 'utf8'),
    };
};

/**
 *
 */
const getOutputFilePath = (outputPattern) => {
    const parentDirPath = (OUTPUT_DIR + '/' + outputPattern).replace(/\/[^/]*$/, '');
    const fileNames = fs.readdirSync(parentDirPath);
    for (const fileName of fileNames) {
        if (fileName.endsWith('.js')) {
            return parentDirPath + '/' + fileName;
        }
    }
};

/*
const tweakClient = (clientBundle) => {
    const freshClientContent = clientBundle.content.replace('console.info', 'false&&console.info');
    clientBundle.content = freshClientContent;
};*/

/**
 *
 */
const renameClient = (clientBundle, hash) => {
    const oldName = clientBundle.filePath.match(/[^\\/]*$/)[0];
    const freshName = oldName.replace('.js', `-${hash}.js`);

    const freshFilePath = clientBundle.filePath.replace(oldName, freshName);
    fs.renameSync(clientBundle.filePath, freshFilePath);

    const mapFilePath = clientBundle.filePath + '.map';
    if (fs.existsSync(mapFilePath)) {
        const freshMapFilePath = mapFilePath.replace(oldName, freshName);
        fs.renameSync(mapFilePath, freshMapFilePath);
    }

    clientBundle.filePath = freshFilePath;
    clientBundle.content = clientBundle.content.replace(oldName + '.map', freshName + '.map');
};

/**
 *
 */
const updateCachedPaths = (swBundle) => {
    const filePaths = findFiles(OUTPUT_DIR);
    const outputDirNameLength = OUTPUT_DIR.length;
    const relativePaths = filePaths.map((filePath) => filePath.substring(outputDirNameLength));
    const cachedPaths = relativePaths.filter((relativePath) => !relativePath.includes('/sw.js'));
    cachedPaths.unshift('/');
    const cachedPathsMarkerRegExp = new RegExp(`['"]${CACHED_PATHS_MARKER}['"]`);
    swBundle.content = swBundle.content.replace(cachedPathsMarkerRegExp, JSON.stringify(cachedPaths));
};

/**
 *
 */
const updateIndex = (clientBundle) => {
    const indexPath = OUTPUT_DIR + '/index.html';
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const relativePath = clientBundle.filePath.substring(OUTPUT_DIR.length + 1);
    const freshIndexContent = indexContent.replace(CLIENT_PATH_MARKER, relativePath);
    fs.writeFileSync(indexPath, freshIndexContent);
};

/**
 *
 */
const refreshBrowser = async () => {
    await sendkeys.activate('Google Chrome');
    sendkeys.send('^r');
    await sendkeys.activate('destiny –'); // reactivate WebStorm
};

/**
 *
 */
const getFocusedPath = () => {
    const argument = process.argv.at(-1);
    assume(argument, 'Nothing to focus on!');

    const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
    const dir = __dirname + '/../src/';
    const found = findFileOrDirByPattern(dir, argument);
    assume(found, 'Focus not found!');

    const sibling = found.replace('.js', '.test.js');
    return fs.existsSync(sibling) ? sibling : found;
};

/**
 *
 */
const findFileOrDirByPattern = (dir, pathOrPattern) => {
    if (fs.existsSync(pathOrPattern)) {
        return path.resolve(pathOrPattern);
    } else {
        const pattern = new RegExp(pathOrPattern);
        return scan(dir, pattern);
    }
};

/**
 *
 */
const scan = (dir, pattern) => {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fullPath.match(pattern)) {
            return fullPath;
        }
        if (fs.statSync(fullPath).isDirectory()) {
            const result = scan(fullPath, pattern);
            if (result) {
                return result;
            }
        }
    }
    return null;
};
// =====================================================================================================================
//  R U N
// =====================================================================================================================
build();
