import fs from 'fs';

/**
 * https://stackoverflow.com/a/16684530
 */
const findFiles = (dir, pattern = null, results = []) => {
    const unixDir = dir.replaceAll('\\', '/');
    const list = fs.readdirSync(unixDir);
    for (const file of list) {
        const fullPath = unixDir + '/' + file;
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            findFiles(fullPath, pattern, results);
        } else {
            if (!pattern || fullPath.match(pattern)) {
                results.push(fullPath);
            }
        }
    }
    return results;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default findFiles;
