import gsap from 'gsap';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const MIN_DURATION = 0.1; // seconds
const MAX_DURATION = 1; // seconds

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 * A better version than the official element.scrollIntoView():
 * - performs the scroll with a smooth animation
 * - ensures nothing changes if the element is already into view
 * - brings the element into center if any of its pixels where outside the view
 * - takes virtual header/footers into consideration
 * // TODO find all parent scrollers and ensure they are also in view
 * // TODO also handle the X-axis
 */
const scrollIntoView = (element, options = {}) => {
    const {header = 0, footer = 0} = options;
    const bounds = element.getBoundingClientRect();
    const {scrollY, innerHeight} = window;

    const elementRect = {
        top: bounds.top + scrollY,
        bottom: bounds.bottom + scrollY,
        height: bounds.height,
    };

    const viewportRect = {
        top: header + scrollY,
        bottom: innerHeight - footer + scrollY,
        height: innerHeight - header - footer,
    };

    if (elementRect.top >= viewportRect.top && elementRect.bottom <= viewportRect.bottom) {
        // console.log('Already inside the viewport!');
        return;
    }

    let futureViewportY = elementRect.top - (viewportRect.height - elementRect.height) / 2;

    // If the element is taller than the viewport, we'll scroll to its beginning:
    futureViewportY = Math.min(futureViewportY, elementRect.top);

    // Ensure the scroll is possible at the top:
    futureViewportY = Math.max(futureViewportY, header);

    // Ensure the scroll is possible at the bottom:
    futureViewportY = Math.min(futureViewportY, document.body.scrollHeight - footer - viewportRect.height);

    const futureScrollY = Math.round(futureViewportY - header);
    const travel = scrollY - futureScrollY;
    if (!travel) {
        return;
    }

    const object = {
        scrollY,
    };
    gsap.to(object, {
        scrollY: futureScrollY,
        duration: proposeDuration(Math.abs(futureScrollY - scrollY)),
        onUpdate: () => {
            window.scrollTo(0, object.scrollY);
        },
    });
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const proposeDuration = (travelDistance) => {
    let duration = Math.log(travelDistance) / 10;
    duration = Math.max(MIN_DURATION, Math.min(duration, MAX_DURATION));
    return duration;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default scrollIntoView;
