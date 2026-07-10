"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var mystrings_1 = require("../../loc/mystrings");
var SearchBar = function (_a) {
    var value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder;
    var resolvedPlaceholder = placeholder !== null && placeholder !== void 0 ? placeholder : mystrings_1.strings.SearchPlaceholder;
    return (React.createElement("div", { style: {
            display: 'flex',
            alignItems: 'center',
            height: 38,
            borderRadius: 20,
            border: '1px solid #c7c9cc',
            backgroundColor: '#ffffff',
            paddingLeft: 12,
            paddingRight: 12,
            gap: 8,
            boxSizing: 'border-box',
            flexShrink: 0,
            minWidth: 240,
            outline: 'none',
        } },
        React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "#605e5c", "aria-hidden": "true", style: { flexShrink: 0 } },
            React.createElement("path", { d: "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" })),
        React.createElement("input", { type: "text", placeholder: resolvedPlaceholder, "aria-label": resolvedPlaceholder, value: value, onChange: function (e) { return onChange(e.target.value); }, style: {
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 13,
                color: '#323130',
                width: '100%',
                lineHeight: '1',
            } }),
        value && (React.createElement("button", { onClick: function () { return onChange(''); }, "aria-label": mystrings_1.strings.ClearSearch, style: {
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                color: '#605e5c',
                flexShrink: 0,
            } },
            React.createElement("svg", { width: "10", height: "10", viewBox: "0 0 12 12", fill: "currentColor", "aria-hidden": "true" },
                React.createElement("path", { d: "M.293.293a1 1 0 0 1 1.414 0L6 4.586 10.293.293a1 1 0 1 1 1.414 1.414L7.414 6l4.293 4.293a1 1 0 0 1-1.414 1.414L6 7.414l-4.293 4.293A1 1 0 0 1 .293 10.707L4.586 6 .293 1.707A1 1 0 0 1 .293.293Z" }))))));
};
exports.default = SearchBar;
//# sourceMappingURL=SearchBar.js.map