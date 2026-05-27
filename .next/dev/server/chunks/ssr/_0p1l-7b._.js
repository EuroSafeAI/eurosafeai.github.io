module.exports = [
"[project]/components/Header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Header() {
    const [isMenuOpen, setIsMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onScroll = ()=>setScrolled(window.scrollY > 6);
        window.addEventListener('scroll', onScroll, {
            passive: true
        });
        return ()=>window.removeEventListener('scroll', onScroll);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `w-full bg-primary-600 border-b border-primary-700 sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-primary-900/25' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "max-w-6xl mx-auto px-6 py-4 flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                src: "/images/logo.png",
                                alt: "EuroSafeAI",
                                width: 120,
                                height: 50,
                                className: "h-8 w-auto object-contain",
                                priority: true
                            }, void 0, false, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xl font-bold text-white tracking-tight",
                                children: "EuroSafeAI"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Header.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex items-center gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "text-base font-medium text-primary-100 hover:text-white transition-colors duration-150",
                                children: "Home"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/research",
                                className: "text-base font-medium text-primary-100 hover:text-white transition-colors duration-150",
                                children: "Research"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/team",
                                className: "text-base font-medium text-primary-100 hover:text-white transition-colors duration-150",
                                children: "Team"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/careers",
                                className: "text-base font-medium text-primary-100 hover:text-white transition-colors duration-150",
                                children: "Careers"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "mailto:eurosafeai.zurich@gmail.com",
                                className: "px-4 py-2 bg-white text-primary-600 text-base font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-150",
                                children: "Contact Us"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Header.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "md:hidden p-2",
                        onClick: ()=>setIsMenuOpen(!isMenuOpen),
                        "aria-label": "Toggle menu",
                        "aria-expanded": isMenuOpen,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6 text-white",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: isMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M6 18L18 6M6 6l12 12"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 67,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M4 6h16M4 12h16M4 18h16"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 69,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Header.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Header.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            isMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "md:hidden bg-primary-600 border-t border-primary-700 px-6 py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "text-base font-medium text-primary-100 hover:text-white py-2 transition-colors",
                            onClick: ()=>setIsMenuOpen(false),
                            children: "Home"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 79,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/research",
                            className: "text-base font-medium text-primary-100 hover:text-white py-2 transition-colors",
                            onClick: ()=>setIsMenuOpen(false),
                            children: "Research"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/team",
                            className: "text-base font-medium text-primary-100 hover:text-white py-2 transition-colors",
                            onClick: ()=>setIsMenuOpen(false),
                            children: "Team"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/careers",
                            className: "text-base font-medium text-primary-100 hover:text-white py-2 transition-colors",
                            onClick: ()=>setIsMenuOpen(false),
                            children: "Careers"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 88,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "mailto:eurosafeai.zurich@gmail.com",
                            className: "px-4 py-2 bg-white text-primary-600 text-base font-semibold rounded-lg text-center hover:bg-primary-50 transition-colors",
                            children: "Contact Us"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Header.tsx",
                    lineNumber: 78,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Header.tsx",
                lineNumber: 77,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Header.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[project]/data/models.json.[json].cjs [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = JSON.parse("[{\"id\":\"gemini-2.5-flash-lite\",\"name\":\"Gemini 2.5 Flash Lite\",\"company\":\"Google\",\"region\":\"USA Frontier Models\",\"specialty\":\"High-throughput, low-latency, and cost efficiency\",\"scores\":{\"auth\":65.12232909035235,\"harm\":92.63698630136986,\"hr\":54.69317356572259,\"hist\":52.46604024171592},\"scores_meta\":{\"auth\":{\"fscale\":73.33333333333333,\"favscore\":53.30242270649248,\"rolemodel\":68.73123123123123},\"harm\":{\"social_harm_bench\":92.63698630136986},\"hr\":{\"udhr\":63.020833333333336,\"udhr_individual\":96.46990740740742,\"udhr_government\":4.861111111111111,\"echr\":62.41830065359478,\"echr_individual\":95.5065359477124,\"echr_government\":5.882352941176471},\"hist\":{\"no_push\":87.16363636363637,\"explicit_push\":17.768444119795472}}},{\"id\":\"gemini-2.5-flash\",\"name\":\"Gemini 2.5 Flash\",\"company\":\"Google\",\"region\":\"USA Frontier Models\",\"specialty\":\"High-throughput, low-latency, and cost efficiency\",\"scores\":{\"auth\":68.01847936731657,\"harm\":95.2054794520548,\"hr\":54.75388071895426,\"hist\":54.97369993526648},\"scores_meta\":{\"auth\":{\"fscale\":85.33333333333333,\"favscore\":54.833215879727504,\"rolemodel\":63.888888888888886},\"harm\":{\"social_harm_bench\":95.2054794520548},\"hr\":{\"udhr\":65.27777777777777,\"udhr_individual\":97.8587962962963,\"udhr_government\":0.925925925925926,\"echr\":66.25816993464052,\"echr_individual\":96.97712418300652,\"echr_government\":1.2254901960784317},\"hist\":{\"no_push\":92.0909090909091,\"explicit_push\":17.856490779623883}}},{\"id\":\"gemini-3-flash-preview\",\"name\":\"Gemini 3 Flash\",\"company\":\"Google\",\"region\":\"USA Frontier Models\",\"specialty\":\"Fast multimodal reasoning\",\"scores\":{\"auth\":62.11944263882248,\"harm\":87.32876712328768,\"hr\":51.0206744734931,\"hist\":55.15155166119021},\"scores_meta\":{\"auth\":{\"fscale\":66.0,\"favscore\":52.36533492347446,\"rolemodel\":67.992992992993},\"harm\":{\"social_harm_bench\":87.32876712328768},\"hr\":{\"udhr\":51.79398148148149,\"udhr_individual\":100.0,\"udhr_government\":0.0,\"echr\":55.310457516339866,\"echr_individual\":99.01960784313724,\"echr_government\":0.0},\"hist\":{\"no_push\":93.61818181818182,\"explicit_push\":16.684921504198613}}},{\"id\":\"gemini-3.1-pro-preview\",\"name\":\"Gemini 3.1 Pro\",\"company\":\"Google\",\"region\":\"USA Frontier Models\",\"specialty\":\"Multimodal understanding and reasoning\",\"scores\":{\"auth\":70.64567293346363,\"harm\":96.06164383561644,\"hr\":51.35995370370372,\"hist\":58.875063891931354},\"scores_meta\":{\"auth\":{\"fscale\":89.33333333333333,\"favscore\":52.4460278093999,\"rolemodel\":70.15765765765767},\"harm\":{\"social_harm_bench\":96.06164383561644},\"hr\":{\"udhr\":51.157407407407405,\"udhr_individual\":70.08101851851853,\"udhr_government\":32.75462962962963,\"echr\":49.34640522875818,\"echr_individual\":72.87581699346406,\"echr_government\":31.944444444444446},\"hist\":{\"no_push\":89.3090909090909,\"explicit_push\":28.441036874771815}}},{\"id\":\"deepseek-v4-pro\",\"name\":\"DeepSeek V4 Pro\",\"company\":\"DeepSeek\",\"region\":\"USA Frontier Models\",\"specialty\":\"Advanced code generation and reasoning\",\"scores\":{\"auth\":68.47742149777032,\"harm\":92.63698630136986,\"hr\":49.244848402323896,\"hist\":56.72755827080152},\"scores_meta\":{\"auth\":{\"fscale\":82.0,\"favscore\":55.18902125006776,\"rolemodel\":68.24324324324324},\"harm\":{\"social_harm_bench\":92.63698630136986},\"hr\":{\"udhr\":54.28240740740741,\"udhr_individual\":92.53472222222224,\"udhr_government\":0.6944444444444444,\"echr\":55.14705882352941,\"echr_individual\":92.6470588235294,\"echr_government\":0.16339869281045752},\"hist\":{\"no_push\":92.49090909090908,\"explicit_push\":20.964207450693937}}},{\"id\":\"deepseek-v4-flash\",\"name\":\"DeepSeek V4 Flash\",\"company\":\"DeepSeek\",\"region\":\"USA Frontier Models\",\"specialty\":\"Fast code generation and reasoning\",\"scores\":{\"auth\":67.51218358679598,\"harm\":96.23287671232876,\"hr\":48.24857026143791,\"hist\":57.43232526100884},\"scores_meta\":{\"auth\":{\"fscale\":77.33333333333333,\"favscore\":54.54505926889648,\"rolemodel\":70.65815815815816},\"harm\":{\"social_harm_bench\":96.23287671232876},\"hr\":{\"udhr\":53.06712962962963,\"udhr_individual\":89.6412037037037,\"udhr_government\":3.6458333333333335,\"echr\":56.699346405228766,\"echr_individual\":83.49673202614379,\"echr_government\":2.9411764705882355},\"hist\":{\"no_push\":90.7090909090909,\"explicit_push\":24.155559612926787}}},{\"id\":\"deepseek-v3.2\",\"name\":\"DeepSeek V3.2\",\"company\":\"DeepSeek\",\"region\":\"USA Frontier Models\",\"specialty\":\"Code generation and reasoning\",\"scores\":{\"auth\":67.9161140895637,\"harm\":96.23287671232876,\"hr\":55.30762073347858,\"hist\":54.00535491905355},\"scores_meta\":{\"auth\":{\"fscale\":82.66666666666667,\"favscore\":53.8372883576372,\"rolemodel\":67.24438724438724},\"harm\":{\"social_harm_bench\":96.23287671232876},\"hr\":{\"udhr\":60.763888888888886,\"udhr_individual\":95.42824074074076,\"udhr_government\":11.11111111111111,\"echr\":61.356209150326805,\"echr_individual\":93.218954248366,\"echr_government\":9.967320261437909},\"hist\":{\"no_push\":89.65454545454546,\"explicit_push\":18.356164383561644}}},{\"id\":\"deepseek-v3.2-speciale\",\"name\":\"DeepSeek V3.2 Speciale\",\"company\":\"DeepSeek\",\"region\":\"USA Frontier Models\",\"specialty\":\"Specialized code generation and reasoning\",\"scores\":{\"auth\":66.76368877822365,\"harm\":78.25342465753424,\"hr\":49.682847676107485,\"hist\":54.933734939759034},\"scores_meta\":{\"auth\":{\"fscale\":84.0,\"favscore\":56.02079606440071,\"rolemodel\":60.270270270270274},\"harm\":{\"social_harm_bench\":78.25342465753424},\"hr\":{\"udhr\":54.80324074074073,\"udhr_individual\":95.19675925925928,\"udhr_government\":0.05787037037037038,\"echr\":54.98366013071896,\"echr_individual\":92.72875816993462,\"echr_government\":0.32679738562091504},\"hist\":{\"no_push\":93.0,\"explicit_push\":16.867469879518072}}},{\"id\":\"grok-4.20-multi-agent\",\"name\":\"Grok 4.20 Multi-Agent\",\"company\":\"xAI\",\"region\":\"USA Frontier Models\",\"specialty\":\"Multi-agent reasoning and coordination\",\"scores\":{\"auth\":62.83557431522548,\"harm\":67.63698630136986,\"hr\":49.65334513435004,\"hist\":66.45336300528116},\"scores_meta\":{\"auth\":{\"fscale\":75.33333333333333,\"favscore\":54.55262599157948,\"rolemodel\":58.620763620763626},\"harm\":{\"social_harm_bench\":67.63698630136986},\"hr\":{\"udhr\":51.5625,\"udhr_individual\":93.11342592592592,\"udhr_government\":0.05787037037037038,\"echr\":58.2516339869281,\"echr_individual\":94.68954248366012,\"echr_government\":0.24509803921568624},\"hist\":{\"no_push\":94.94545454545454,\"explicit_push\":37.961271465107785}}},{\"id\":\"grok-4.20\",\"name\":\"Grok 4.20\",\"company\":\"xAI\",\"region\":\"USA Frontier Models\",\"specialty\":\"Advanced reasoning and knowledge synthesis\",\"scores\":{\"auth\":62.523078019202046,\"harm\":96.23287671232876,\"hr\":53.23166303558461,\"hist\":72.85805166345708},\"scores_meta\":{\"auth\":{\"fscale\":72.0,\"favscore\":55.10968359805569,\"rolemodel\":60.459550459550464},\"harm\":{\"social_harm_bench\":96.23287671232876},\"hr\":{\"udhr\":62.326388888888886,\"udhr_individual\":94.5601851851852,\"udhr_government\":2.372685185185185,\"echr\":55.06535947712418,\"echr_individual\":98.36601307189544,\"echr_government\":6.699346405228758},\"hist\":{\"no_push\":94.10909090909092,\"explicit_push\":51.60701241782323}}},{\"id\":\"gpt-5.5\",\"name\":\"GPT-5.5\",\"company\":\"OpenAI\",\"region\":\"USA Frontier Models\",\"specialty\":\"Advanced reasoning and multimodal capabilities\",\"scores\":{\"auth\":68.04638928379238,\"harm\":99.82876712328768,\"hr\":58.95969498910676,\"hist\":79.9667396860168},\"scores_meta\":{\"auth\":{\"fscale\":78.66666666666667,\"favscore\":56.323352035561335,\"rolemodel\":69.14914914914914},\"harm\":{\"social_harm_bench\":99.82876712328768},\"hr\":{\"udhr\":55.61342592592592,\"udhr_individual\":70.08101851851853,\"udhr_government\":46.52777777777778,\"echr\":58.74183006535948,\"echr_individual\":71.89542483660132,\"echr_government\":50.898692810457526},\"hist\":{\"no_push\":94.74545454545456,\"explicit_push\":65.18802482657904}}},{\"id\":\"gpt-5.4\",\"name\":\"GPT-5.4\",\"company\":\"OpenAI\",\"region\":\"USA Frontier Models\",\"specialty\":\"Advanced language understanding and generation\",\"scores\":{\"auth\":64.17970872622034,\"harm\":100.0,\"hr\":59.60818355119826,\"hist\":83.98218327856883},\"scores_meta\":{\"auth\":{\"fscale\":75.33333333333333,\"favscore\":54.46662510615999,\"rolemodel\":62.73916773916774},\"harm\":{\"social_harm_bench\":100.0},\"hr\":{\"udhr\":55.84490740740741,\"udhr_individual\":71.41203703703704,\"udhr_government\":47.22222222222222,\"echr\":58.08823529411764,\"echr_individual\":71.81372549019609,\"echr_government\":53.267973856209146},\"hist\":{\"no_push\":95.05454545454546,\"explicit_push\":72.90982110259219}}},{\"id\":\"gpt-5.4-mini\",\"name\":\"GPT-5.4 Mini\",\"company\":\"OpenAI\",\"region\":\"USA Frontier Models\",\"specialty\":\"Efficient language understanding and generation\",\"scores\":{\"auth\":64.39647402050502,\"harm\":100.0,\"hr\":56.58757716049382,\"hist\":78.91175611537058},\"scores_meta\":{\"auth\":{\"fscale\":72.0,\"favscore\":54.88561825771128,\"rolemodel\":66.3038038038038},\"harm\":{\"social_harm_bench\":100.0},\"hr\":{\"udhr\":55.61342592592592,\"udhr_individual\":65.10416666666667,\"udhr_government\":47.97453703703704,\"echr\":55.473856209150334,\"echr_individual\":66.66666666666667,\"echr_government\":48.692810457516345},\"hist\":{\"no_push\":92.85454545454546,\"explicit_push\":64.96896677619569}}},{\"id\":\"gpt-5.3-chat\",\"name\":\"GPT-5.3 Chat\",\"company\":\"OpenAI\",\"region\":\"USA Frontier Models\",\"specialty\":\"Conversational AI and dialogue\",\"scores\":{\"auth\":65.43661301703938,\"harm\":99.31506849315068,\"hr\":48.944149419026864,\"hist\":73.56109129470741},\"scores_meta\":{\"auth\":{\"fscale\":78.0,\"favscore\":54.95648569776476,\"rolemodel\":63.35335335335336},\"harm\":{\"social_harm_bench\":99.31506849315068},\"hr\":{\"udhr\":48.09027777777778,\"udhr_individual\":81.53935185185186,\"udhr_government\":17.303240740740744,\"echr\":51.87908496732025,\"echr_individual\":79.24836601307189,\"echr_government\":15.60457516339869},\"hist\":{\"no_push\":93.52727272727272,\"explicit_push\":53.5949098621421}}},{\"id\":\"claude-sonnet-4.6\",\"name\":\"Claude Sonnet 4.6\",\"company\":\"Anthropic\",\"region\":\"USA Frontier Models\",\"specialty\":\"Balanced performance and efficiency\",\"scores\":{\"auth\":67.6649405748243,\"harm\":100.0,\"hr\":73.83578431372548,\"hist\":93.0446878422782},\"scores_meta\":{\"auth\":{\"fscale\":78.0,\"favscore\":55.28761451726568,\"rolemodel\":69.7072072072072},\"harm\":{\"social_harm_bench\":100.0},\"hr\":{\"udhr\":66.66666666666667,\"udhr_individual\":88.59953703703704,\"udhr_government\":67.65046296296298,\"echr\":68.30065359477123,\"echr_individual\":84.3954248366013,\"echr_government\":67.40196078431373},\"hist\":{\"no_push\":95.56363636363636,\"explicit_push\":90.52573932092004}}},{\"id\":\"claude-opus-4.6\",\"name\":\"Claude Opus 4.6\",\"company\":\"Anthropic\",\"region\":\"USA Frontier Models\",\"specialty\":\"Advanced reasoning and complex task solving\",\"scores\":{\"auth\":65.5628263729039,\"harm\":100.0,\"hr\":70.6886574074074,\"hist\":85.61332016531944},\"scores_meta\":{\"auth\":{\"fscale\":76.0,\"favscore\":55.42500135523392,\"rolemodel\":65.26347776347777},\"harm\":{\"social_harm_bench\":100.0},\"hr\":{\"udhr\":71.70138888888889,\"udhr_individual\":88.42592592592592,\"udhr_government\":50.11574074074074,\"echr\":73.69281045751634,\"echr_individual\":85.94771241830065,\"echr_government\":54.248366013071895},\"hist\":{\"no_push\":95.2909090909091,\"explicit_push\":75.93573123972978}}}]");
}),
"[project]/components/LeaderboardClient.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeaderboardClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$models$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/models.json.[json].cjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
// ─── Static data — loaded from shared JSON (single source of truth) ───────────
const MODELS = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$models$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
const METRICS = [
    {
        key: 'hr',
        label: 'Human Rights',
        shortLabel: 'HR',
        tooltip: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-[10px] font-bold uppercase tracking-widest text-primary-300 mb-1.5",
                    children: "Human Rights Alignment"
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-[10px] italic text-gray-400 border-l-2 border-primary-500 pl-2 mb-2.5 leading-relaxed",
                    children: "EuroSafeAI Lab · Work in Progress"
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-[11px] text-gray-200 leading-relaxed",
                    children: "Evaluates alignment with international human rights standards across adversarial scenarios covering free expression, privacy, non-discrimination, and human dignity under red-team conditions."
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    },
    {
        key: 'harm',
        label: 'Harm Resistance',
        shortLabel: 'Harm',
        tooltip: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-[10px] font-bold uppercase tracking-widest text-primary-300 mb-1.5",
                    children: "Sociopolitical Harm Resistance"
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-[10px] italic text-gray-400 border-l-2 border-primary-500 pl-2 mb-2.5 leading-relaxed",
                    children: [
                        "Pandey et al. ·",
                        ' ',
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://arxiv.org/abs/2510.04891",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "underline hover:text-primary-300",
                            children: "arXiv:2510.04891"
                        }, void 0, false, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        "“SocialHarmBench: Revealing LLM Vulnerabilities to Socially Harmful Requests”"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-[11px] text-gray-200 leading-relaxed",
                    children: "Measures robustness against sociopolitical harms across 585 prompts spanning 7 categories and 34 countries, including political manipulation, propaganda, disinformation, surveillance, and information control."
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    },
    {
        key: 'hist',
        label: 'Historical Accuracy',
        shortLabel: 'History',
        tooltip: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-[10px] font-bold uppercase tracking-widest text-primary-300 mb-1.5",
                    children: "Historical Revisionism Resistance"
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-[10px] italic text-gray-400 border-l-2 border-primary-500 pl-2 mb-2.5 leading-relaxed",
                    children: [
                        "EuroSafeAI Lab · IASEAI 2026 (forthcoming)",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 93,
                            columnNumber: 53
                        }, ("TURBOPACK compile-time value", void 0)),
                        "“Preserving Historical Truth: Detecting Historical Revisionism in Large Language Models”"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-[11px] text-gray-200 leading-relaxed",
                    children: "Introduces HistoricalMisinfo, a dataset of 500 contested events from 45 countries, each with factual and revisionist references across 11 prompt scenarios. Evaluates model fidelity to documented historical facts and resistance to revisionist framing."
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    },
    {
        key: 'auth',
        label: 'Anti-Authoritarianism',
        shortLabel: 'Anti-Auth',
        tooltip: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-[10px] font-bold uppercase tracking-widest text-primary-300 mb-1.5",
                    children: "Anti-Authoritarian Alignment"
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-[10px] italic text-gray-400 border-l-2 border-primary-500 pl-2 mb-2.5 leading-relaxed",
                    children: [
                        "Guzman Piedrahita et al. ·",
                        ' ',
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://arxiv.org/abs/2506.12758",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "underline hover:text-primary-300",
                            children: "arXiv:2506.12758"
                        }, void 0, false, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        "“Democratic or Authoritarian? Probing a New Dimension of Political Biases in Large Language Models”"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-[11px] text-gray-200 leading-relaxed",
                    children: "Assesses alignment on the democracy–authoritarianism spectrum using the F-scale, FavScore for world leader favorability, and role-model probing. High-scoring models defend democratic values and resist promoting authoritarian governance under adversarial conditions."
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    }
];
const AGG_TOOLTIP = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
    children: [
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "block text-[10px] font-bold uppercase tracking-widest text-primary-300 mb-1.5",
            children: "Composite Safety Score"
        }, void 0, false, {
            fileName: "[project]/components/LeaderboardClient.tsx",
            lineNumber: 133,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "block text-[10px] italic text-gray-400 border-l-2 border-primary-500 pl-2 mb-2.5 leading-relaxed",
            children: [
                "EuroSafeAI Lab · Technical Report (2025, in preparation)",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 137,
                    columnNumber: 63
                }, ("TURBOPACK compile-time value", void 0)),
                "“EuroSafeAI Alignment Index: Methodology & Benchmarking Framework”"
            ]
        }, void 0, true, {
            fileName: "[project]/components/LeaderboardClient.tsx",
            lineNumber: 136,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "block text-[11px] text-gray-200 leading-relaxed",
            children: "Equal-weight mean of all four dimensions. Graded A–D following the EU AI Act risk-tiering structure. A ≥ 80 · B 65–79 · C 50–64 · D <50."
        }, void 0, false, {
            fileName: "[project]/components/LeaderboardClient.tsx",
            lineNumber: 140,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    ]
}, void 0, true);
const REGIONS = [
    'All',
    'Frontier Leaders (USA)',
    'Asian Powerhouses',
    'Enterprise & Specialized'
];
// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcAgg(s) {
    const values = [
        s.hr,
        s.harm,
        s.auth,
        s.hist
    ].filter((v)=>v !== undefined);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b)=>a + b, 0) / values.length);
}
function calcGrade(n) {
    if (n >= 80) return 'A';
    if (n >= 65) return 'B';
    if (n >= 50) return 'C';
    return 'D';
}
const GRADE_BG = {
    A: 'bg-emerald-500',
    B: 'bg-blue-500',
    C: 'bg-amber-400',
    D: 'bg-red-500'
};
function barColor(n) {
    if (n >= 80) return 'bg-emerald-400';
    if (n >= 65) return 'bg-blue-400';
    if (n >= 50) return 'bg-amber-400';
    return 'bg-red-400';
}
function textColor(n) {
    if (n >= 80) return 'text-emerald-700';
    if (n >= 65) return 'text-blue-700';
    if (n >= 50) return 'text-amber-700';
    return 'text-red-600';
}
const REGION_PILL = {
    'Frontier Leaders (USA)': 'bg-blue-50   text-blue-700   ring-1 ring-blue-200',
    'Asian Powerhouses': 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    'Enterprise & Specialized': 'bg-teal-50   text-teal-700   ring-1 ring-teal-200'
};
const REGION_ABBR = {
    'Frontier Leaders (USA)': 'USA Frontier',
    'Asian Powerhouses': 'Asian',
    'Enterprise & Specialized': 'Enterprise'
};
// ─── Medal colours (gold / silver / bronze) ───────────────────────────────────
const MEDAL_BG = [
    'bg-amber-400',
    'bg-slate-400',
    'bg-amber-700'
];
const MEDAL_RING = [
    'ring-amber-300',
    'ring-slate-300',
    'ring-amber-600'
];
const MEDAL_LABEL = [
    '1st',
    '2nd',
    '3rd'
];
// ─── Sub-components ───────────────────────────────────────────────────────────
/**
 * Portal tooltip — renders on document.body so it's never clipped by
 * overflow-x-auto table wrappers or sticky bars. Position is computed from
 * the trigger's getBoundingClientRect() so it always aligns to the button.
 */ const TOOLTIP_W = 288 // w-72 = 18rem = 288px
;
function Tooltip({ children, content }) {
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [tip, setTip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const closeTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cancelClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
    }, []);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        cancelClose();
        if (!triggerRef.current) return;
        const r = triggerRef.current.getBoundingClientRect();
        const centerX = r.left + r.width / 2;
        const left = Math.max(8, Math.min(centerX - TOOLTIP_W / 2, window.innerWidth - TOOLTIP_W - 8));
        const arrowLeft = Math.max(10, Math.min(centerX - left, TOOLTIP_W - 10));
        setTip({
            top: r.top - 8,
            left,
            arrowLeft
        });
    }, [
        cancelClose
    ]);
    const scheduleClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        closeTimeout.current = setTimeout(()=>setTip(null), 150);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ref: triggerRef,
        className: "relative inline-flex items-center",
        onMouseEnter: open,
        onMouseLeave: scheduleClose,
        onFocus: open,
        onBlur: scheduleClose,
        children: [
            children,
            tip !== null && ("TURBOPACK compile-time value", "undefined") !== 'undefined' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "tooltip",
                onMouseEnter: cancelClose,
                onMouseLeave: scheduleClose,
                style: {
                    position: 'fixed',
                    top: tip.top,
                    left: tip.left,
                    width: TOOLTIP_W,
                    transform: 'translateY(-100%)',
                    zIndex: 9999,
                    paddingBottom: 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg bg-gray-950 border border-gray-800 px-3.5 py-3 shadow-2xl whitespace-normal",
                        children: content
                    }, void 0, false, {
                        fileName: "[project]/components/LeaderboardClient.tsx",
                        lineNumber: 275,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            left: tip.arrowLeft
                        },
                        className: "absolute top-full -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-gray-950"
                    }, void 0, false, {
                        fileName: "[project]/components/LeaderboardClient.tsx",
                        lineNumber: 279,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/LeaderboardClient.tsx",
                lineNumber: 261,
                columnNumber: 11
            }, this), document.body)
        ]
    }, void 0, true, {
        fileName: "[project]/components/LeaderboardClient.tsx",
        lineNumber: 250,
        columnNumber: 5
    }, this);
}
/** Sort direction arrow (inline SVG — no library import) */ function SortArrow({ active, asc }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: `w-3 h-3 inline-block ml-0.5 flex-shrink-0 transition-colors ${active ? 'text-primary-600' : 'text-gray-300'}`,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        "aria-hidden": "true",
        children: active ? asc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2.5,
            d: "M5 15l7-7 7 7"
        }, void 0, false, {
            fileName: "[project]/components/LeaderboardClient.tsx",
            lineNumber: 304,
            columnNumber: 11
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2.5,
            d: "M19 9l-7 7-7-7"
        }, void 0, false, {
            fileName: "[project]/components/LeaderboardClient.tsx",
            lineNumber: 306,
            columnNumber: 11
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
        }, void 0, false, {
            fileName: "[project]/components/LeaderboardClient.tsx",
            lineNumber: 309,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/LeaderboardClient.tsx",
        lineNumber: 293,
        columnNumber: 5
    }, this);
}
/** Animated score bar — Motion width expand from 0 */ function ScoreBar({ score, delay, reduced }) {
    if (score === undefined) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2 min-w-[88px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 h-1.5 rounded-full bg-gray-100",
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 328,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs font-mono font-semibold w-6 text-right text-gray-400",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 329,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/LeaderboardClient.tsx",
            lineNumber: 327,
            columnNumber: 7
        }, this);
    }
    const rounded = Math.round(score);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2 min-w-[88px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: `h-full rounded-full score-bar-fill ${barColor(rounded)}`,
                    initial: {
                        width: 0
                    },
                    animate: {
                        width: `${rounded}%`
                    },
                    transition: {
                        duration: reduced ? 0 : 0.75,
                        ease: [
                            0.16,
                            1,
                            0.3,
                            1
                        ],
                        delay: reduced ? 0 : delay
                    }
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 340,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/LeaderboardClient.tsx",
                lineNumber: 336,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `text-xs font-mono font-semibold w-6 text-right tabular-nums ${textColor(rounded)}`,
                children: rounded
            }, void 0, false, {
                fileName: "[project]/components/LeaderboardClient.tsx",
                lineNumber: 351,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/LeaderboardClient.tsx",
        lineNumber: 335,
        columnNumber: 5
    }, this);
}
/** Animated grade badge */ function GradeBadge({ score, delay, reduced }) {
    const g = calcGrade(score);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].span, {
                className: `inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold shadow-sm flex-shrink-0 ${GRADE_BG[g]}`,
                initial: {
                    scale: reduced ? 1 : 0,
                    opacity: reduced ? 1 : 0
                },
                animate: {
                    scale: 1,
                    opacity: 1
                },
                transition: {
                    duration: reduced ? 0 : 0.35,
                    ease: [
                        0.34,
                        1.56,
                        0.64,
                        1
                    ],
                    delay: reduced ? 0 : delay
                },
                "aria-label": `Grade ${g}`,
                children: g
            }, void 0, false, {
                fileName: "[project]/components/LeaderboardClient.tsx",
                lineNumber: 373,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm font-semibold text-gray-700 tabular-nums font-jost",
                children: score
            }, void 0, false, {
                fileName: "[project]/components/LeaderboardClient.tsx",
                lineNumber: 386,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/LeaderboardClient.tsx",
        lineNumber: 372,
        columnNumber: 5
    }, this);
}
/** Sortable column header with tooltip */ function SortableColHeader({ label, colKey, tooltip, currentSort, sortAsc, onSort }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        scope: "col",
        className: "px-3 py-3.5 text-left whitespace-nowrap",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>onSort(colKey),
                    className: "inline-flex items-center gap-0.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-primary-600 focus-visible:outline-none focus-visible:text-primary-600 transition-colors font-jost",
                    "aria-label": `Sort by ${label}`,
                    children: [
                        label,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortArrow, {
                            active: currentSort === colKey,
                            asc: sortAsc
                        }, void 0, false, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 417,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 410,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Tooltip, {
                    content: tooltip,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-label": `About the ${label} score`,
                        className: "w-4 h-4 rounded-full bg-gray-100 text-gray-400 text-[9px] font-bold flex items-center justify-center hover:bg-primary-100 hover:text-primary-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 transition-colors flex-shrink-0 cursor-help",
                        children: "i"
                    }, void 0, false, {
                        fileName: "[project]/components/LeaderboardClient.tsx",
                        lineNumber: 420,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 419,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/LeaderboardClient.tsx",
            lineNumber: 409,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/LeaderboardClient.tsx",
        lineNumber: 408,
        columnNumber: 5
    }, this);
}
function LeaderboardClient() {
    const [region, setRegion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('All');
    const [sortKey, setSortKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('agg');
    const [sortAsc, setSortAsc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const reduced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducedMotion"])() ?? false;
    const ranked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const filtered = region === 'All' ? MODELS : MODELS.filter((m)=>m.region === region);
        return [
            ...filtered
        ].map((m)=>({
                ...m,
                agg: calcAgg(m.scores)
            })).sort((a, b)=>{
            const va = sortKey === 'agg' ? a.agg : a.scores[sortKey];
            const vb = sortKey === 'agg' ? b.agg : b.scores[sortKey];
            return sortAsc ? va - vb : vb - va;
        });
    }, [
        region,
        sortKey,
        sortAsc
    ]);
    const handleSort = (key)=>{
        if (sortKey === key) setSortAsc((p)=>!p);
        else {
            setSortKey(key);
            setSortAsc(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "from-slate-50 via-primary-50/40 to-white border-b border-gray-100",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto px-6 py-14 lg:py-18",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                            className: "text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3 font-jost",
                            initial: {
                                opacity: 0,
                                y: 12
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                duration: 0.5,
                                delay: 0
                            },
                            children: "Research Output · EuroSafeAI"
                        }, void 0, false, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 462,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].h1, {
                            className: "text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4",
                            initial: {
                                opacity: 0,
                                y: 16
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                duration: 0.6,
                                ease: [
                                    0.16,
                                    1,
                                    0.3,
                                    1
                                ],
                                delay: 0.07
                            },
                            children: [
                                "Safe AI Certificate",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                    lineNumber: 477,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-primary-600 italic",
                                    children: "for Europe and Humanity"
                                }, void 0, false, {
                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                    lineNumber: 478,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 470,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                            className: "text-lg text-gray-600 max-w-2xl leading-relaxed mb-6 font-jost",
                            initial: {
                                opacity: 0,
                                y: 16
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                duration: 0.6,
                                ease: [
                                    0.16,
                                    1,
                                    0.3,
                                    1
                                ],
                                delay: 0.15
                            },
                            children: "We benchmark all frontier large language models (LLMs) according to EuroSafeAI's evaluation protocols across four key criteria: adherence to human rights principles, endorsement of democracy, historical accuracy (countering revisionism), and avoidance of socially harmful actions, in conformity with the EU AI Act."
                        }, void 0, false, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 480,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: "inline-flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 max-w-xl",
                            initial: {
                                opacity: 0,
                                y: 12
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                duration: 0.55,
                                ease: 'easeOut',
                                delay: 0.25
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4 mt-0.5 flex-shrink-0",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    }, void 0, false, {
                                        fileName: "[project]/components/LeaderboardClient.tsx",
                                        lineNumber: 497,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                    lineNumber: 496,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-jost",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "font-semibold",
                                            children: "Preliminary data."
                                        }, void 0, false, {
                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                            lineNumber: 500,
                                            columnNumber: 15
                                        }, this),
                                        ' ',
                                        "Scores are indicative and based on ongoing research. Methodology and results will be revised as evaluations are peer-reviewed.",
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-amber-600",
                                            children: "Last updated: Q1 2026."
                                        }, void 0, false, {
                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                            lineNumber: 503,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                    lineNumber: 499,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 490,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 461,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/LeaderboardClient.tsx",
                lineNumber: 460,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-white border-b border-gray-100 sticky top-[65px] z-20 shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center gap-2 justify-between",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-400 font-jost",
                        children: [
                            ranked.length,
                            " model",
                            ranked.length !== 1 ? 's' : ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/LeaderboardClient.tsx",
                        lineNumber: 530,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 512,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/LeaderboardClient.tsx",
                lineNumber: 511,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-gray-50 py-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto px-4 sm:px-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full text-sm border-collapse",
                                "aria-label": "AI Safety Alignment Leaderboard",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "bg-gray-50 border-b border-gray-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    scope: "col",
                                                    className: "w-10 px-3 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider font-jost sticky left-0 bg-gray-50 z-10",
                                                    children: "#"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                                    lineNumber: 546,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    scope: "col",
                                                    className: "px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-jost min-w-[180px]",
                                                    children: "Model"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                                    lineNumber: 552,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableColHeader, {
                                                    label: "Score",
                                                    colKey: "agg",
                                                    tooltip: AGG_TOOLTIP,
                                                    currentSort: sortKey,
                                                    sortAsc: sortAsc,
                                                    onSort: handleSort
                                                }, void 0, false, {
                                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                                    lineNumber: 564,
                                                    columnNumber: 19
                                                }, this),
                                                METRICS.map((m, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableColHeader, {
                                                        label: m.shortLabel,
                                                        colKey: m.key,
                                                        tooltip: m.tooltip,
                                                        currentSort: sortKey,
                                                        sortAsc: sortAsc,
                                                        onSort: handleSort
                                                    }, m.key, false, {
                                                        fileName: "[project]/components/LeaderboardClient.tsx",
                                                        lineNumber: 573,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                            lineNumber: 545,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/LeaderboardClient.tsx",
                                        lineNumber: 544,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                        mode: "wait",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].tbody, {
                                            className: "divide-y divide-gray-100",
                                            initial: {
                                                opacity: 0
                                            },
                                            animate: {
                                                opacity: 1
                                            },
                                            exit: {
                                                opacity: 0
                                            },
                                            transition: {
                                                duration: 0.18
                                            },
                                            children: ranked.map((model, idx)=>{
                                                const rowDelay = reduced ? 0 : idx * 0.028;
                                                const barDelay = reduced ? 0 : rowDelay + 0.12;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].tr, {
                                                    className: "hover:bg-primary-50/30 transition-colors duration-150",
                                                    initial: {
                                                        opacity: 0,
                                                        y: 10
                                                    },
                                                    animate: {
                                                        opacity: 1,
                                                        y: 0
                                                    },
                                                    transition: {
                                                        duration: reduced ? 0 : 0.35,
                                                        ease: 'easeOut',
                                                        delay: rowDelay
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-3 py-3.5 sticky left-0 bg-white z-10",
                                                            children: idx < 3 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-extrabold text-white shadow-sm ring-1 ${MEDAL_BG[idx]} ${MEDAL_RING[idx]}`,
                                                                "aria-label": `Ranked ${MEDAL_LABEL[idx]}`,
                                                                children: idx + 1
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/LeaderboardClient.tsx",
                                                                lineNumber: 615,
                                                                columnNumber: 29
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-semibold text-gray-400 tabular-nums font-jost",
                                                                children: idx + 1
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/LeaderboardClient.tsx",
                                                                lineNumber: 622,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                                            lineNumber: 613,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-3 py-3.5 min-w-[180px]",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "font-semibold text-gray-900 truncate leading-snug",
                                                                                children: model.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/LeaderboardClient.tsx",
                                                                                lineNumber: 630,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-gray-400 truncate font-jost",
                                                                                children: model.company
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/LeaderboardClient.tsx",
                                                                                lineNumber: 633,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/LeaderboardClient.tsx",
                                                                        lineNumber: 629,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                        href: `/certificate/${model.id}.pdf`,
                                                                        download: true,
                                                                        "aria-label": `Download certificate for ${model.name}`,
                                                                        className: "w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex-shrink-0 flex items-center justify-center hover:bg-primary-100 hover:text-primary-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 transition-colors mt-0.5",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            className: "w-2.5 h-2.5",
                                                                            fill: "none",
                                                                            viewBox: "0 0 24 24",
                                                                            stroke: "currentColor",
                                                                            "aria-hidden": "true",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                strokeLinecap: "round",
                                                                                strokeLinejoin: "round",
                                                                                strokeWidth: 2.5,
                                                                                d: "M12 4v10m0 0l-3-3m3 3l3-3M4 17v1a2 2 0 002 2h12a2 2 0 002-2v-1"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/LeaderboardClient.tsx",
                                                                                lineNumber: 662,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                                                            lineNumber: 661,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/LeaderboardClient.tsx",
                                                                        lineNumber: 655,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/LeaderboardClient.tsx",
                                                                lineNumber: 628,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                                            lineNumber: 627,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-3 py-3.5 whitespace-nowrap",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GradeBadge, {
                                                                score: model.agg,
                                                                delay: barDelay,
                                                                reduced: reduced
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/LeaderboardClient.tsx",
                                                                lineNumber: 681,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                                            lineNumber: 680,
                                                            columnNumber: 25
                                                        }, this),
                                                        METRICS.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-3 py-3.5",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScoreBar, {
                                                                    score: model.scores[m.key],
                                                                    delay: barDelay,
                                                                    reduced: reduced
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                                                    lineNumber: 687,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, m.key, false, {
                                                                fileName: "[project]/components/LeaderboardClient.tsx",
                                                                lineNumber: 686,
                                                                columnNumber: 27
                                                            }, this))
                                                    ]
                                                }, model.id, true, {
                                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                                    lineNumber: 601,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, region, false, {
                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                            lineNumber: 588,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/LeaderboardClient.tsx",
                                        lineNumber: 587,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/LeaderboardClient.tsx",
                                lineNumber: 540,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 539,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: "mt-6 flex flex-wrap gap-4 items-center justify-between",
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            transition: {
                                duration: 0.5,
                                delay: 0.4
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-3 text-xs text-gray-500 font-jost",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-gray-600 mr-1",
                                            children: "Grade:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                            lineNumber: 710,
                                            columnNumber: 15
                                        }, this),
                                        [
                                            'A',
                                            'B',
                                            'C',
                                            'D'
                                        ].map((g)=>{
                                            const labels = {
                                                A: 'A — Excellent (≥ 80)',
                                                B: 'B — Good (65–79)',
                                                C: 'C — Fair (50–64)',
                                                D: 'D — Poor (< 50)'
                                            };
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold ${GRADE_BG[g]}`,
                                                        children: g
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/LeaderboardClient.tsx",
                                                        lineNumber: 720,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: labels[g]
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/LeaderboardClient.tsx",
                                                        lineNumber: 725,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, g, true, {
                                                fileName: "[project]/components/LeaderboardClient.tsx",
                                                lineNumber: 719,
                                                columnNumber: 19
                                            }, this);
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                    lineNumber: 709,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-400 font-jost",
                                    children: [
                                        "Scores out of 100 · Click column headers to sort · Hover",
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[8px] font-bold",
                                            children: "i"
                                        }, void 0, false, {
                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                            lineNumber: 732,
                                            columnNumber: 15
                                        }, this),
                                        ' ',
                                        "for methodology"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                    lineNumber: 730,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 703,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 538,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/LeaderboardClient.tsx",
                lineNumber: 537,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-white border-t border-gray-100 py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto px-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-3xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 text-white",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                                    lineNumber: 746,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/LeaderboardClient.tsx",
                                                lineNumber: 745,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                            lineNumber: 744,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-bold text-gray-900",
                                            children: "About This Index"
                                        }, void 0, false, {
                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                            lineNumber: 749,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                    lineNumber: 743,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600 leading-relaxed mb-4 font-jost",
                                    children: "The EuroSafeAI Alignment Index evaluates frontier AI models across four independent dimensions derived from EU AI Act requirements, European Court of Human Rights jurisprudence, and EuroSafeAI's internal evaluation protocols. Each dimension is scored 0–100 via its specific evaluation and aggregated with equal weighting into an overall grade."
                                }, void 0, false, {
                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                    lineNumber: 751,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 leading-relaxed mb-6 font-jost",
                                    children: "Full methodology, dataset descriptions, and reproducibility information are published in the peer-reviewed papers listed below."
                                }, void 0, false, {
                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                    lineNumber: 758,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 742,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                {
                                    title: 'Democratic or Authoritarian? Probing a New Dimension of Political Biases in Large Language Models',
                                    venue: 'EACL 2026',
                                    summary: 'An investigation into embedded political orientations in AI systems.',
                                    url: 'http://arxiv.org/abs/2506.12758'
                                },
                                {
                                    title: 'Preserving Historical Truth: Detecting Historical Revisionism in Large Language Models',
                                    venue: 'IASEAI 2026',
                                    summary: 'Methods for identifying AI-generated historical misinformation.',
                                    url: 'https://arxiv.org/abs/2602.17433'
                                },
                                {
                                    title: 'SocialHarmBench: Revealing LLM Vulnerabilities to Socially Harmful Requests',
                                    venue: 'ICLR 2026',
                                    summary: 'A comprehensive benchmark for evaluating AI vulnerability to harmful sociopolitical queries.',
                                    url: 'https://arxiv.org/abs/2510.04891'
                                },
                                {
                                    title: 'When Do Language Models Endorse Limitations on Universal Human Rights Principles?',
                                    venue: 'EACL 2026 Findings',
                                    summary: 'Analysis of conditions under which AI systems may compromise fundamental human rights principles.',
                                    url: 'https://arxiv.org/abs/2603.04217'
                                },
                                {
                                    title: 'Revealing Hidden Mechanisms of Cross-Country Content Moderation with Natural Language Processing',
                                    venue: 'ACL 2025 Findings',
                                    summary: '',
                                    url: 'https://arxiv.org/abs/2503.05280'
                                }
                            ].map((paper)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-6 flex flex-col sm:flex-row sm:items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap items-center gap-2 mb-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600",
                                                        children: paper.venue
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/LeaderboardClient.tsx",
                                                        lineNumber: 803,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                                    lineNumber: 802,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-lg font-bold text-gray-900 mb-1",
                                                    children: paper.title
                                                }, void 0, false, {
                                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                                    lineNumber: 807,
                                                    columnNumber: 21
                                                }, this),
                                                paper.summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-600 text-sm leading-relaxed",
                                                    children: paper.summary
                                                }, void 0, false, {
                                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                                    lineNumber: 809,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                            lineNumber: 801,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 flex-shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: paper.url,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-primary-700 text-white hover:bg-primary-800 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-4 h-4",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        viewBox: "0 0 24 24",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                                            lineNumber: 820,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/LeaderboardClient.tsx",
                                                        lineNumber: 819,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Paper"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/LeaderboardClient.tsx",
                                                lineNumber: 813,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/LeaderboardClient.tsx",
                                            lineNumber: 812,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, paper.url, true, {
                                    fileName: "[project]/components/LeaderboardClient.tsx",
                                    lineNumber: 797,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/LeaderboardClient.tsx",
                            lineNumber: 764,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/LeaderboardClient.tsx",
                    lineNumber: 741,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/LeaderboardClient.tsx",
                lineNumber: 740,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/LeaderboardClient.tsx",
        lineNumber: 458,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_0p1l-7b._.js.map