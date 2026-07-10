"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var mystrings_1 = require("../../loc/mystrings");
var FilterBar = function (_a) {
    var filters = _a.filters, members = _a.members, values = _a.values, onChange = _a.onChange;
    if (!filters || filters.length === 0) {
        return null;
    }
    var getDistinctValues = function (fieldName) {
        var unique = new Set();
        members.forEach(function (member) {
            var _a;
            var value = (_a = member[fieldName]) !== null && _a !== void 0 ? _a : (member.customProperties && member.customProperties[fieldName]);
            if (value)
                unique.add(String(value));
        });
        return Array.from(unique).sort();
    };
    return (React.createElement(React.Fragment, null, filters.map(function (filter) {
        var options = getDistinctValues(filter.fieldName);
        var disabled = options.length === 0;
        var selected = values[filter.fieldName] || '';
        return (React.createElement("div", { key: filter.fieldName, style: {
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                flexShrink: 0,
            } },
            React.createElement("select", { "aria-label": filter.label, value: selected, disabled: disabled, onChange: function (e) {
                    var val = e.target.value;
                    onChange(filter.fieldName, val || null);
                }, style: {
                    height: 38,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    borderRadius: 20,
                    border: '1px solid #c7c9cc',
                    backgroundColor: disabled ? '#f3f2f1' : '#ffffff',
                    color: selected ? '#323130' : '#605e5c',
                    fontSize: 13,
                    paddingLeft: 16,
                    paddingRight: selected ? 52 : 36,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    minWidth: 150,
                    boxSizing: 'border-box',
                } },
                React.createElement("option", { value: "" }, filter.label),
                options.map(function (opt) { return (React.createElement("option", { key: opt, value: opt }, opt)); })),
            React.createElement("svg", { width: "10", height: "10", viewBox: "0 0 10 6", fill: "none", "aria-hidden": "true", style: {
                    position: 'absolute',
                    right: selected ? 30 : 14,
                    pointerEvents: 'none',
                    color: disabled ? '#605e5c' : '#605e5c',
                } },
                React.createElement("path", { d: "M1 1l4 4 4-4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })),
            selected && (React.createElement("button", { onClick: function (e) {
                    e.stopPropagation();
                    onChange(filter.fieldName, null);
                }, "aria-label": mystrings_1.strings.ClearSearch, title: mystrings_1.strings.ClearSearch, style: {
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#605e5c',
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                } },
                React.createElement("svg", { width: "8", height: "8", viewBox: "0 0 12 12", fill: "currentColor", "aria-hidden": "true" },
                    React.createElement("path", { d: "M.293.293a1 1 0 0 1 1.414 0L6 4.586 10.293.293a1 1 0 1 1 1.414 1.414L7.414 6l4.293 4.293a1 1 0 0 1-1.414 1.414L6 7.414l-4.293 4.293A1 1 0 0 1 .293 10.707L4.586 6 .293 1.707A1 1 0 0 1 .293.293Z" }))))));
    })));
};
exports.default = FilterBar;
//# sourceMappingURL=FilterBar.js.map