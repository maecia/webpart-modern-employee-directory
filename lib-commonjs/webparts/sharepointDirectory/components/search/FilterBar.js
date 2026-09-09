"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var mystrings_1 = require("../../loc/mystrings");
var MultiSelect = function (_a) {
    var label = _a.label, options = _a.options, selected = _a.selected, disabled = _a.disabled, onToggle = _a.onToggle, onClear = _a.onClear;
    var _b = React.useState(false), open = _b[0], setOpen = _b[1];
    var _c = React.useState(''), search = _c[0], setSearch = _c[1];
    var containerRef = React.useRef(null);
    var inputRef = React.useRef(null);
    var filtered = React.useMemo(function () {
        if (!search)
            return options;
        var q = search.toLowerCase();
        return options.filter(function (o) { return o.toLowerCase().includes(q); });
    }, [options, search]);
    React.useEffect(function () {
        if (open)
            requestAnimationFrame(function () { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); });
    }, [open]);
    var handleBlur = function (e) {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setOpen(false);
            setSearch('');
        }
    };
    var handleToggle = function () {
        if (disabled)
            return;
        setOpen(function (o) { return !o; });
        if (open)
            setSearch('');
    };
    var handleKeyDown = function (e) {
        if (e.key === 'Escape') {
            setOpen(false);
            setSearch('');
        }
    };
    var hasSelection = selected.length > 0;
    var buttonLabel = hasSelection
        ? selected.length === 1
            ? selected[0]
            : "".concat(label, " (").concat(selected.length, ")")
        : label;
    return (React.createElement("div", { ref: containerRef, tabIndex: -1, style: { position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }, onKeyDown: handleKeyDown, onBlur: handleBlur },
        React.createElement("button", { type: "button", "aria-haspopup": "listbox", "aria-expanded": open, "aria-label": label, disabled: disabled, onClick: handleToggle, style: {
                height: 38,
                borderRadius: 20,
                border: "1px solid ".concat(open ? '#1B7A6E' : hasSelection ? '#1B7A6E' : '#c7c9cc'),
                backgroundColor: hasSelection ? '#f0faf8' : disabled ? '#f3f2f1' : '#ffffff',
                color: hasSelection ? '#1B7A6E' : disabled ? '#a19f9d' : '#605e5c',
                fontWeight: hasSelection ? 600 : 400,
                fontSize: 13,
                paddingLeft: 16,
                paddingRight: hasSelection ? 52 : 36,
                cursor: disabled ? 'not-allowed' : 'pointer',
                outline: 'none',
                minWidth: 150,
                maxWidth: 220,
                boxSizing: 'border-box',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
            } }, buttonLabel),
        React.createElement("svg", { width: "10", height: "10", viewBox: "0 0 10 6", fill: "none", "aria-hidden": "true", style: {
                position: 'absolute',
                right: hasSelection ? 30 : 14,
                pointerEvents: 'none',
                color: hasSelection ? '#1B7A6E' : '#605e5c',
                transform: open ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s ease',
            } },
            React.createElement("path", { d: "M1 1l4 4 4-4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })),
        hasSelection && (React.createElement("button", { type: "button", onClick: function (e) { e.stopPropagation(); onClear(); }, "aria-label": mystrings_1.strings.ClearSearch, title: mystrings_1.strings.ClearSearch, style: {
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
                color: '#1B7A6E',
                borderRadius: '50%',
                width: 16,
                height: 16,
            } },
            React.createElement("svg", { width: "8", height: "8", viewBox: "0 0 12 12", fill: "currentColor", "aria-hidden": "true" },
                React.createElement("path", { d: "M.293.293a1 1 0 0 1 1.414 0L6 4.586 10.293.293a1 1 0 1 1 1.414 1.414L7.414 6l4.293 4.293a1 1 0 0 1-1.414 1.414L6 7.414l-4.293 4.293A1 1 0 0 1 .293 10.707L4.586 6 .293 1.707A1 1 0 0 1 .293.293Z" })))),
        open && (React.createElement("div", { role: "listbox", "aria-multiselectable": "true", "aria-label": label, style: {
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 4,
                minWidth: '100%',
                maxWidth: 320,
                backgroundColor: '#ffffff',
                border: '1px solid #edebe9',
                borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                zIndex: 9999,
                overflow: 'hidden',
            } },
            React.createElement("div", { style: { padding: '8px 8px 4px', borderBottom: '1px solid #f3f2f1' } },
                React.createElement("div", { style: { position: 'relative', display: 'flex', alignItems: 'center' } },
                    React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", style: { position: 'absolute', left: 8, color: '#605e5c', pointerEvents: 'none' } },
                        React.createElement("path", { d: "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z", fill: "currentColor" })),
                    React.createElement("input", { ref: inputRef, type: "text", value: search, onChange: function (e) { return setSearch(e.target.value); }, placeholder: mystrings_1.strings.FilterSearch, style: {
                            width: '100%',
                            height: 32,
                            paddingLeft: 30,
                            paddingRight: 8,
                            border: '1px solid #c7c9cc',
                            borderRadius: 6,
                            fontSize: 13,
                            outline: 'none',
                            boxSizing: 'border-box',
                            color: '#323130',
                        } }))),
            React.createElement("ul", { style: { margin: 0, padding: '4px 0', listStyle: 'none', maxHeight: 220, overflowY: 'auto' } }, filtered.length === 0 ? (React.createElement("li", { style: { padding: '8px 16px', fontSize: 13, color: '#605e5c' } }, "\u2014")) : (filtered.map(function (opt) {
                var isChecked = selected.includes(opt);
                return (React.createElement("li", { key: opt, role: "option", "aria-selected": isChecked, onMouseDown: function (e) { return e.preventDefault(); }, onClick: function () { return onToggle(opt); }, style: {
                        padding: '7px 12px',
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: '#323130',
                        backgroundColor: isChecked ? '#f0faf8' : 'transparent',
                        userSelect: 'none',
                    }, onMouseEnter: function (e) {
                        if (!isChecked)
                            e.currentTarget.style.backgroundColor = '#faf9f8';
                    }, onMouseLeave: function (e) {
                        ;
                        e.currentTarget.style.backgroundColor = isChecked ? '#f0faf8' : 'transparent';
                    } },
                    React.createElement("span", { "aria-hidden": "true", style: {
                            width: 16,
                            height: 16,
                            borderRadius: 3,
                            border: "2px solid ".concat(isChecked ? '#1B7A6E' : '#c7c9cc'),
                            backgroundColor: isChecked ? '#1B7A6E' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'background-color 0.1s ease, border-color 0.1s ease',
                        } }, isChecked && (React.createElement("svg", { width: "10", height: "8", viewBox: "0 0 10 8", fill: "none" },
                        React.createElement("path", { d: "M1 4l3 3 5-6", stroke: "#ffffff", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })))),
                    opt));
            })))))));
};
var FilterBar = function (_a) {
    var filters = _a.filters, members = _a.members, values = _a.values, onChange = _a.onChange;
    if (!filters || filters.length === 0)
        return null;
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
        var selected = values[filter.fieldName] || [];
        return (React.createElement(MultiSelect, { key: filter.fieldName, label: filter.label, options: options, selected: selected, disabled: disabled, onToggle: function (val) {
                var current = values[filter.fieldName] || [];
                var next = current.includes(val)
                    ? current.filter(function (v) { return v !== val; })
                    : tslib_1.__spreadArray(tslib_1.__spreadArray([], current, true), [val], false);
                onChange(filter.fieldName, next.length > 0 ? next : null);
            }, onClear: function () { return onChange(filter.fieldName, null); } }));
    })));
};
exports.default = FilterBar;
//# sourceMappingURL=FilterBar.js.map