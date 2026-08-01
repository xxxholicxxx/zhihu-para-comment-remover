// ==UserScript==
// @name         知乎去除段评虚线
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除class属性，保留所有内容
// @author       HoLiX
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @grant        GM_addStyle
// ==/UserScript==
(function() {
    'use strict';
    const TARGET_CLASS = 'highlight-wrap';
    // 覆盖所有可能的组合
    GM_addStyle(`
        /* 基本覆盖 */
        .${TARGET_CLASS} {
            all: unset !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            background: none !important;
            border: none !important;
        }

        /* 覆盖 .highlight-wrap:after */
        .${TARGET_CLASS}:after,
        .${TARGET_CLASS}::after {
            content: none !important;
            display: none !important;
            all: unset !important;
            opacity: 0 !important;
        }
        /* 覆盖 .highlight-wrap:before */
        .${TARGET_CLASS}:before,
        .${TARGET_CLASS}::before {
            content: none !important;
            display: none !important;
            all: unset !important;
            opacity: 0 !important;
        }

        /* 覆盖 .highlight-wrap.has-comments */
        .${TARGET_CLASS}.has-comments,
        .has-comments.${TARGET_CLASS} {
            all: unset !important;
            background: none !important;
            border: none !important;
            box-shadow: none !important;
        }

        /* 覆盖 .highlight-wrap.has-comments:after */
        .${TARGET_CLASS}.has-comments:after,
        .${TARGET_CLASS}.has-comments::after {
            content: none !important;
            display: none !important;
            all: unset !important;
            opacity: 0 !important;
        }

        /* 覆盖其他可能的组合 */
        [class*="${TARGET_CLASS}"]:after,
        [class*="${TARGET_CLASS}"]::after {
            content: none !important;
            display: none !important;
            all: unset !important;
        }

        [class*="${TARGET_CLASS}"]:before,
        [class*="${TARGET_CLASS}"]::before {
            content: none !important;
            display: none !important;
            all: unset !important;
        }

        /* 覆盖所有子伪元素 */
        .${TARGET_CLASS} *:after,
        .${TARGET_CLASS} *::after,
        .${TARGET_CLASS} *:before,
        .${TARGET_CLASS} *::before {
            content: none !important;
            display: none !important;
            all: unset !important;
        }

        /* 覆盖带id的组合 */
        [id].${TARGET_CLASS},
        .${TARGET_CLASS}[id] {
            all: unset !important;
            background: none !important;
            border: none !important;
        }

        /* 覆盖后代选择器 */
        .${TARGET_CLASS} [class],
        .${TARGET_CLASS} [id],
        [class] .${TARGET_CLASS},
        [id] .${TARGET_CLASS} {
            all: unset !important;
        }
    `);
})();
