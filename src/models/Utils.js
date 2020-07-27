import ReactHtmlParser from 'react-html-parser';
export const setSEOContent = (props) => {
    let headElement = document.querySelector('head');
    if (props.title) {
        let titleElement = document.querySelector('title');
        if (titleElement) {
            titleElement.innerHTML = props.title;
        }
        let metaTitleElement = document.querySelector('meta[name="title"]');
        if (metaTitleElement) {
            metaTitleElement.setAttribute('content', props.title);
        }
        let metaOgTitleElement = document.querySelector('meta[property="og:title"]');
        if (!metaOgTitleElement) {
            metaOgTitleElement = document.createElement('meta');
            metaOgTitleElement.setAttribute('property', "og:title");
            headElement === null || headElement === void 0 ? void 0 : headElement.appendChild(metaOgTitleElement);
        }
        if (metaOgTitleElement) {
            metaOgTitleElement.setAttribute('content', props.title);
        }
    }
    if (props.description) {
        let metaDescriptionElement = document.querySelector('meta[name="description"]');
        if (metaDescriptionElement) {
            metaDescriptionElement.setAttribute('content', props.description);
        }
        let metaOgDescriptionElement = document.querySelector('meta[property="og:description"]');
        if (!metaOgDescriptionElement) {
            metaOgDescriptionElement = document.createElement('meta');
            metaOgDescriptionElement.setAttribute('property', "og:description");
            headElement === null || headElement === void 0 ? void 0 : headElement.appendChild(metaOgDescriptionElement);
        }
        if (metaOgDescriptionElement) {
            metaOgDescriptionElement.setAttribute('content', props.description);
        }
    }
    if (props.icon) {
        let metaIconElement = document.querySelector('link[rel="icon"]');
        if (metaIconElement) {
            metaIconElement.setAttribute('href', props.icon);
        }
        let metaOgIconElement = document.querySelector('meta[property="og:image"]');
        if (!metaOgIconElement) {
            metaOgIconElement = document.createElement('meta');
            metaOgIconElement.setAttribute('property', "og:image");
            headElement === null || headElement === void 0 ? void 0 : headElement.appendChild(metaOgIconElement);
        }
        if (metaOgIconElement) {
            metaOgIconElement.setAttribute('content', props.icon);
        }
    }
    if (props.keywords) {
        let metaKeywordsElement = document.querySelector('link[name="keywords"]');
        if (metaKeywordsElement) {
            metaKeywordsElement.setAttribute('content', props.keywords);
        }
    }
    let metaLinkElement = document.querySelector('link[rel="canonical"]');
    let metaOgLinkElement = document.querySelector('meta[property="og:url"]');
    if (!metaOgLinkElement) {
        metaOgLinkElement = document.createElement('meta');
        metaOgLinkElement.setAttribute('property', "og:url");
        headElement === null || headElement === void 0 ? void 0 : headElement.appendChild(metaOgLinkElement);
    }
    if (metaLinkElement) {
        if (props.link) {
            metaLinkElement.setAttribute('href', props.link);
            metaOgLinkElement.setAttribute('content', props.link);
        }
        else {
            let url = window.location.href.replace(window.location.search, '');
            metaLinkElement.setAttribute('href', url);
            metaOgLinkElement.setAttribute('content', url);
        }
    }
};
export function onScrollElementAtParentElement(childClass, parentClass, offset) {
    var _a;
    if (!offset) {
        offset = 0;
    }
    let childElement = document.querySelector(childClass);
    let parentElement = document.querySelector(parentClass);
    let isMobileScreen = window.innerWidth <= 768;
    if (childElement && parentElement) {
        let sHeight = (_a = childElement.getBoundingClientRect()) === null || _a === void 0 ? void 0 : _a.x;
        parentElement.scrollTo({ top: sHeight + (isMobileScreen ? 0 : sHeight / 3) + offset, behavior: 'smooth' });
    }
}
export function onScrollToElement(childClass, offset) {
    if (!offset) {
        offset = 0;
    }
    let childElement = document.querySelector(childClass);
    let isMobileScreen = window.innerWidth <= 768;
    if (childElement) {
        window.scrollTo({ top: childElement.scrollHeight + (isMobileScreen ? 0 : childElement.clientHeight / 3) + offset, behavior: 'smooth' });
    }
}
export function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
export function stringToHtml(str) {
    return ReactHtmlParser(str.replace(/<o:p>/g, '').replace(/<\/o:p>/, ''));
}
