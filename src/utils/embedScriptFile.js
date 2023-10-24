import assume from './assume';

// =================================================================================================================
//  P U B L I C
// =================================================================================================================
/**
 *
 */
const embedScriptFile = (url) => {
    return new Promise((resolve) => {
        const element = document.createElement('script');
        element.src = url;
        element.addEventListener('load', () => {
            resolve();
        });
        element.addEventListener('error', () => {
            assume(false, `Cannot load script "${url}"!`);
        });
        document.head.appendChild(element);
    });
};

// =================================================================================================================
//  E X P O R T
// =================================================================================================================
export default embedScriptFile;
