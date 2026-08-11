// ==UserScript==
// @name         知乎去除段评虚线 + 去除关键词链接
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  移除class属性，保留所有内容；并去除关键词超链接（清空父节点其余内容）
// @author       HoLiX
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @grant        GM_addStyle
// ==/UserScript==
(function() {
    'use strict';
    // ============ 功能一：去除段评虚线（原有逻辑，未改动） ============
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
    // ============ 功能二：去除关键词链接（新增） ============
    const SELECTOR = 'a.RichContent-EntityWord';
    function process(root) {
        const seen = new Set(); // 同一父节点只处理一次，防止一父多链接时崩溃
        root.querySelectorAll(SELECTOR).forEach(link => {
            const parent = link.parentNode;
            if (!parent || seen.has(parent)) return;
            seen.add(parent);
            parent.innerText = link.innerText; // 保留链接文字，清掉父节点其余所有内容
        });
    }
    // ① 处理页面已存在的内容
    if (document.body) {
        process(document);
    } else {
        document.addEventListener('DOMContentLoaded', () => process(document));
    }
    // ② 监听动态加载的内容（知乎滚动加载 / 回答展开等）
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.type !== 'childList' || !m.addedNodes.length) continue;
            m.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) process(node);
            });
        }
    });
    const startObserving = () => {
        observer.observe(document.body, { childList: true, subtree: true });
    };
    if (document.body) startObserving();
    else document.addEventListener('DOMContentLoaded', startObserving);
})();
