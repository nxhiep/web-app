"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onScrollElementAtParentElement = onScrollElementAtParentElement;
exports.onScrollToElement = onScrollToElement;
exports.scrollToTop = scrollToTop;
exports.stringToHtml = stringToHtml;
exports.setSEOContent = void 0;

var _reactHtmlParser = _interopRequireDefault(require("react-html-parser"));

var setSEOContent = props => {
  var headElement = document.querySelector('head');

  if (props.title) {
    var titleElement = document.querySelector('title');

    if (titleElement) {
      titleElement.innerHTML = props.title;
    }

    var metaTitleElement = document.querySelector('meta[name="title"]');

    if (metaTitleElement) {
      metaTitleElement.setAttribute('content', props.title);
    }

    var metaOgTitleElement = document.querySelector('meta[property="og:title"]');

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
    var metaDescriptionElement = document.querySelector('meta[name="description"]');

    if (metaDescriptionElement) {
      metaDescriptionElement.setAttribute('content', props.description);
    }

    var metaOgDescriptionElement = document.querySelector('meta[property="og:description"]');

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
    var metaIconElement = document.querySelector('link[rel="icon"]');

    if (metaIconElement) {
      metaIconElement.setAttribute('href', props.icon);
    }

    var metaOgIconElement = document.querySelector('meta[property="og:image"]');

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
    var metaKeywordsElement = document.querySelector('link[name="keywords"]');

    if (metaKeywordsElement) {
      metaKeywordsElement.setAttribute('content', props.keywords);
    }
  }

  var metaLinkElement = document.querySelector('link[rel="canonical"]');
  var metaOgLinkElement = document.querySelector('meta[property="og:url"]');

  if (!metaOgLinkElement) {
    metaOgLinkElement = document.createElement('meta');
    metaOgLinkElement.setAttribute('property', "og:url");
    headElement === null || headElement === void 0 ? void 0 : headElement.appendChild(metaOgLinkElement);
  }

  if (metaLinkElement) {
    if (props.link) {
      metaLinkElement.setAttribute('href', props.link);
      metaOgLinkElement.setAttribute('content', props.link);
    } else {
      var url = window.location.href.replace(window.location.search, '');
      metaLinkElement.setAttribute('href', url);
      metaOgLinkElement.setAttribute('content', url);
    }
  }
};

exports.setSEOContent = setSEOContent;

function onScrollElementAtParentElement(childClass, parentClass, offset) {
  var _a;

  if (!offset) {
    offset = 0;
  }

  var childElement = document.querySelector(childClass);
  var parentElement = document.querySelector(parentClass);
  var isMobileScreen = window.innerWidth <= 768;

  if (childElement && parentElement) {
    var sHeight = (_a = childElement.getBoundingClientRect()) === null || _a === void 0 ? void 0 : _a.x;
    parentElement.scrollTo({
      top: sHeight + (isMobileScreen ? 0 : sHeight / 3) + offset,
      behavior: 'smooth'
    });
  }
}

function onScrollToElement(childClass, offset) {
  if (!offset) {
    offset = 0;
  }

  var childElement = document.querySelector(childClass);
  var isMobileScreen = window.innerWidth <= 768;

  if (childElement) {
    window.scrollTo({
      top: childElement.scrollHeight + (isMobileScreen ? 0 : childElement.clientHeight / 3) + offset,
      behavior: 'smooth'
    });
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function stringToHtml(str) {
  return (0, _reactHtmlParser.default)(str.replace(/<o:p>/g, '').replace(/<\/o:p>/, ''));
}