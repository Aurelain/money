/**
 * Focuses nothing.
 */
const defocus = () => {
    window.focus(); // for Edge
    if (document.activeElement) {
        document.activeElement['blur']();
    }
    document.body.focus(); // for IE10
    window.getSelection().removeAllRanges();
};

export default defocus;
