"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var mystrings_1 = require("../../loc/mystrings");
var DirectoryConfig_1 = require("../../../../models/DirectoryConfig");
/** Return the human-readable name for a language code, e.g. "fr" → "Français" */
function getLangName(code) {
    var key = "Lang_".concat(code);
    return mystrings_1.strings[key] || code.toUpperCase();
}
// ─── Constants ────────────────────────────────────────────────────────────────
var LOCKED_ORDER = ['photo', 'firstName', 'name'];
/** Fields that cannot be reordered and whose labels cannot be customized — applies to all views */
var LOCKED_KEYS = new Set(LOCKED_ORDER);
// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseLabels(json) {
    try {
        return JSON.parse(json) || {};
    }
    catch (_a) {
        return {};
    }
}
function defaultLabel(key) {
    switch (key) {
        case 'photo':
            return mystrings_1.strings.FieldPhoto;
        case 'name':
            return mystrings_1.strings.FieldName;
        case 'firstName':
            return mystrings_1.strings.FieldFirstName;
        case 'email':
            return mystrings_1.strings.FieldEmail;
        case 'phone':
            return mystrings_1.strings.FieldPhone;
        case 'jobTitle':
            return mystrings_1.strings.FieldJobTitle;
        case 'department':
            return mystrings_1.strings.FieldDepartment;
        case 'officeLocation':
            return mystrings_1.strings.FieldOfficeLocation;
        case 'manager':
            return mystrings_1.strings.FieldManager;
        case 'outlook':
            return mystrings_1.strings.FieldOutlook;
        case 'teams':
            return mystrings_1.strings.FieldTeams;
        default:
            return (0, DirectoryConfig_1.getEntraFieldLabel)(key);
    }
}
/** Ensure locked fields (photo, firstName, name) always come first in their predefined order */
function reorderWithLockedPrefix(keys) {
    var locked = LOCKED_ORDER.filter(function (k) { return keys.includes(k); });
    var rest = keys.filter(function (k) { return !LOCKED_KEYS.has(k); });
    return tslib_1.__spreadArray(tslib_1.__spreadArray([], locked, true), rest, true);
}
// ─── Style factory (dynamic — depends on primaryColor) ────────────────────────
function createStyles(primary) {
    return {
        root: { fontSize: 13, padding: '4px 0' },
        sectionLabel: {
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            color: '#323130',
            marginTop: 12,
            marginBottom: 4,
        },
        // ── Fluent UI dropdown trigger ──────────────────────────────────────────
        selectTrigger: function (open) { return ({
            height: open ? 33 : 32,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0 30px 0 8px',
            appearance: 'none',
            WebkitAppearance: 'none',
            borderRadius: 'var(--borderRadiusMedium, 4px)',
            border: '1px solid var(--colorNeutralStroke1, #d1d1d1)',
            borderBottomWidth: open ? '2px' : '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: open ? primary : 'var(--colorNeutralStrokeAccessiblePressed, #616161)',
            background: '#ffffff',
            fontSize: 14,
            fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
            fontWeight: 400,
            color: '#323130',
            cursor: 'pointer',
            textAlign: 'left',
            boxSizing: 'border-box',
            outline: 'none',
        }); },
        dropdownPanel: {
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 9999,
            background: '#ffffff',
            border: '1px solid #8a8886',
            borderRadius: 2,
            maxHeight: 300,
            overflowY: 'auto',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        },
        groupHeader: {
            fontSize: 11,
            fontWeight: 700,
            color: '#a19f9d',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '8px 8px 3px',
            background: '#faf9f8',
            borderBottom: '1px solid #f3f2f1',
            position: 'sticky',
            top: 0,
            zIndex: 1,
        },
        checkItem: function (checked, hovered) { return ({
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 8px',
            height: 36,
            cursor: 'pointer',
            background: 'transparent',
            userSelect: 'none',
            color: '#201f1e',
            fontSize: 14,
        }); },
        checkBox: function (checked) { return ({
            width: 16,
            height: 16,
            border: checked ? "2px solid ".concat(primary) : '1.5px solid #8a8886',
            borderRadius: 2,
            background: checked ? primary : '#fff',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }); },
        // ── DnD ordered list ──────────────────────────────────────────────────
        divider: {
            height: 1,
            background: '#edebe9',
            margin: '12px 0 8px',
        },
        dragRow: function (isDragging, isDragOver) { return ({
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            padding: '6px 8px',
            marginBottom: 4,
            background: isDragOver ? '#f0f6ff' : isDragging ? '#f3f2f1' : '#faf9f8',
            border: isDragOver ? "1.5px dashed ".concat(primary) : '1px solid #edebe9',
            borderRadius: 4,
            opacity: isDragging ? 0.5 : 1,
            transition: 'background 0.1s, border 0.1s',
        }); },
        lockedRow: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            padding: '6px 8px',
            marginBottom: 4,
            background: '#faf9f8',
            border: '1px solid #edebe9',
            borderRadius: 4,
            opacity: 0.7,
        },
        handle: {
            color: '#8a8886',
            cursor: 'grab',
            userSelect: 'none',
            flexShrink: 0,
            paddingTop: 2,
        },
        handleLocked: {
            color: '#e1dfdd',
            cursor: 'default',
            userSelect: 'none',
            flexShrink: 0,
            paddingTop: 2,
        },
        fieldLabel: {
            flex: 1,
            fontSize: 13,
            color: '#201f1e',
            paddingTop: 1,
        },
        labelRow: {
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            marginTop: 6,
        },
        labelCaption: {
            fontSize: 11,
            fontWeight: 600,
            color: '#605e5c',
            marginBottom: 2,
        },
        labelInput: {
            width: '100%',
            height: 28,
            fontSize: 13,
            padding: '0 6px',
            border: '1px solid #8a8886',
            borderRadius: 2,
            color: '#201f1e',
            background: '#fff',
            boxSizing: 'border-box',
            outline: 'none',
        },
        lockedLabel: {
            fontSize: 13,
            color: '#605e5c',
            padding: '4px 6px',
            background: '#f3f2f1',
            borderRadius: 2,
            userSelect: 'none',
        },
        removeBtn: {
            background: 'none',
            border: 'none',
            padding: '2px 4px',
            cursor: 'pointer',
            color: '#605e5c',
            fontSize: 16,
            lineHeight: '1',
            flexShrink: 0,
        },
        hint: {
            fontSize: 11,
            color: '#605e5c',
            marginBottom: 6,
        },
    };
}
// ─── Main component ──────────────────────────────────────────────────────────
var DnDFieldSelector = function (_a) {
    var view = _a.view, initialKeys = _a.selectedKeys, initialLabelsJson = _a.labelsJson, detectedExtAttrs = _a.detectedExtAttrs, primaryColor = _a.primaryColor, supportedLanguages = _a.supportedLanguages, onUpdateKeys = _a.onUpdateKeys, onUpdateLabels = _a.onUpdateLabels;
    var S = React.useMemo(function () { return createStyles(primaryColor); }, [primaryColor]);
    // ── Inner sub‑components (closed over S) ────────────────────────────────
    var DragHandle = function () { return (React.createElement("svg", { width: "10", height: "16", viewBox: "0 0 10 16", fill: "#8a8886", style: S.handle, "aria-hidden": true },
        React.createElement("circle", { cx: "3", cy: "3", r: "1.5" }),
        React.createElement("circle", { cx: "7", cy: "3", r: "1.5" }),
        React.createElement("circle", { cx: "3", cy: "8", r: "1.5" }),
        React.createElement("circle", { cx: "7", cy: "8", r: "1.5" }),
        React.createElement("circle", { cx: "3", cy: "13", r: "1.5" }),
        React.createElement("circle", { cx: "7", cy: "13", r: "1.5" }))); };
    var CheckItem = function (_a) {
        var label = _a.label, checked = _a.checked, onToggle = _a.onToggle;
        var _b = React.useState(false), hovered = _b[0], setHovered = _b[1];
        return (React.createElement("div", { style: S.checkItem(checked, hovered), onClick: onToggle, onMouseEnter: function () { return setHovered(true); }, onMouseLeave: function () { return setHovered(false); }, role: "checkbox", "aria-checked": checked, tabIndex: 0, onKeyDown: function (e) {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    onToggle();
                }
            } },
            React.createElement("div", { style: S.checkBox(checked) }, checked && (React.createElement("svg", { width: "10", height: "8", viewBox: "0 0 10 8", fill: "#fff", "aria-hidden": true },
                React.createElement("path", { d: "M1 3.5L4 6.5L9 1", stroke: "#fff", strokeWidth: "1.5", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" })))),
            React.createElement("span", null, label)));
    };
    var _b = React.useState(function () {
        return reorderWithLockedPrefix(initialKeys);
    }), keys = _b[0], setKeys = _b[1];
    var _c = React.useState(function () { return parseLabels(initialLabelsJson); }), labels = _c[0], setLabels = _c[1];
    var _d = React.useState(false), dropdownOpen = _d[0], setDropdownOpen = _d[1];
    var dropdownRef = React.useRef(null);
    // Drag state — indices are relative to draggableKeys only
    var dragFromRef = React.useRef(null);
    var _e = React.useState(null), dragOver = _e[0], setDragOver = _e[1];
    var _f = React.useState(null), dragging = _f[0], setDragging = _f[1];
    var groups = (0, DirectoryConfig_1.getAvailableEntraIdFieldGroups)();
    var isSelected = function (k) { return keys.includes(k); };
    var lockedCount = React.useMemo(function () { return LOCKED_ORDER.filter(function (k) { return keys.includes(k); }).length; }, [keys]);
    var draggableKeys = keys;
    // Close dropdown on outside click
    React.useEffect(function () {
        if (!dropdownOpen)
            return;
        var handler = function (e) {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return function () { return document.removeEventListener('mousedown', handler); };
    }, [dropdownOpen]);
    // ── Toggle ────────────────────────────────────────────────────────────────
    var toggle = function (k) {
        var removing = isSelected(k);
        var newKeys = removing
            ? reorderWithLockedPrefix(keys.filter(function (x) { return x !== k; }))
            : reorderWithLockedPrefix(tslib_1.__spreadArray(tslib_1.__spreadArray([], keys, true), [k], false));
        setKeys(newKeys);
        onUpdateKeys(newKeys);
        if (removing) {
            var nl = tslib_1.__assign({}, labels);
            delete nl[k];
            setLabels(nl);
            onUpdateLabels(JSON.stringify(nl));
        }
    };
    // ── Drag & drop ───────────────────────────────────────────────────────────
    var handleDragStart = function (idx) {
        dragFromRef.current = idx;
        setDragging(idx);
    };
    var handleDragOver = function (e, idx) {
        e.preventDefault();
        setDragOver(idx);
    };
    var handleDrop = function (toIdx) {
        var fromIdx = dragFromRef.current;
        dragFromRef.current = null;
        setDragging(null);
        setDragOver(null);
        // Prevent dropping into locked area (indices 0..lockedCount-1)
        if (fromIdx === null || fromIdx === toIdx || toIdx < lockedCount)
            return;
        var next = tslib_1.__spreadArray([], draggableKeys, true);
        var moved = next.splice(fromIdx, 1)[0];
        next.splice(toIdx, 0, moved);
        onUpdateKeys(next);
        setKeys(next);
    };
    var handleDragEnd = function () {
        dragFromRef.current = null;
        setDragging(null);
        setDragOver(null);
    };
    // ── Labels ────────────────────────────────────────────────────────────────
    var updateLabelLocal = function (k, lang, val) {
        setLabels(function (prev) {
            var _a, _b;
            var next = tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[k] = tslib_1.__assign(tslib_1.__assign({}, (prev[k] || {})), (_b = {}, _b[lang] = val, _b)), _a));
            onUpdateLabels(JSON.stringify(next));
            return next;
        });
    };
    // ── Select trigger text ───────────────────────────────────────────────────
    var selectedCount = keys.length;
    var buttonText = selectedCount === 0
        ? mystrings_1.strings.DnD_NoSelection
        : "".concat(selectedCount, " ").concat(mystrings_1.strings.DnD_AvailableFields.toLowerCase());
    var standardFields = [
        { key: 'photo', label: mystrings_1.strings.FieldPhoto },
        { key: 'name', label: mystrings_1.strings.FieldName },
        { key: 'firstName', label: mystrings_1.strings.FieldFirstName },
        { key: 'email', label: mystrings_1.strings.FieldEmail },
        { key: 'phone', label: mystrings_1.strings.FieldPhone },
        { key: 'jobTitle', label: mystrings_1.strings.FieldJobTitle },
        { key: 'department', label: mystrings_1.strings.FieldDepartment },
        { key: 'officeLocation', label: mystrings_1.strings.FieldOfficeLocation },
        { key: 'manager', label: mystrings_1.strings.FieldManager },
        { key: 'outlook', label: mystrings_1.strings.FieldOutlook },
        { key: 'teams', label: mystrings_1.strings.FieldTeams },
    ];
    // ── Render ────────────────────────────────────────────────────────────────
    return (React.createElement("div", { style: S.root },
        React.createElement("span", { style: S.sectionLabel }, mystrings_1.strings.DnD_AvailableFields),
        React.createElement("div", { ref: dropdownRef, style: { position: 'relative', marginBottom: 16 } },
            React.createElement("div", { style: { position: 'relative' } },
                React.createElement("button", { type: "button", style: S.selectTrigger(dropdownOpen), onClick: function () { return setDropdownOpen(function (o) { return !o; }); }, "aria-haspopup": "listbox", "aria-expanded": dropdownOpen },
                    React.createElement("span", { style: {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                            color: selectedCount === 0 ? '#605e5c' : '#323130',
                        } }, buttonText)),
                React.createElement("svg", { fill: "currentColor", "aria-hidden": "true", width: "1em", height: "1em", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg", style: {
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        fontSize: 14,
                        color: '#605e5c',
                    } },
                    React.createElement("path", { d: "M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0Z", fill: "currentColor" }))),
            dropdownOpen && (React.createElement("div", { style: S.dropdownPanel, role: "listbox", "aria-multiselectable": true },
                React.createElement("div", { style: S.groupHeader }, mystrings_1.strings.DnD_StandardGroup),
                standardFields.map(function (f) { return (React.createElement(CheckItem, { key: f.key, label: f.label, checked: isSelected(f.key), onToggle: function () { return toggle(f.key); } })); }),
                groups.map(function (group) { return (React.createElement("div", { key: group.groupKey },
                    React.createElement("div", { style: S.groupHeader }, group.label),
                    group.fields.map(function (f) { return (React.createElement(CheckItem, { key: f.key, label: f.label, checked: isSelected(f.key), onToggle: function () { return toggle(f.key); } })); }))); }),
                detectedExtAttrs.length > 0 && (React.createElement("div", null,
                    React.createElement("div", { style: S.groupHeader }, mystrings_1.strings.DnD_ExtAttrGroup),
                    detectedExtAttrs.map(function (k) { return (React.createElement(CheckItem, { key: k, label: (0, DirectoryConfig_1.getEntraFieldLabel)(k), checked: isSelected(k), onToggle: function () { return toggle(k); } })); })))))),
        React.createElement("span", { style: S.sectionLabel }, mystrings_1.strings.DnD_DisplayOrder),
        keys.length === 0 ? (React.createElement("div", { style: S.hint }, mystrings_1.strings.DnD_NoSelection)) : (React.createElement(React.Fragment, null,
            React.createElement("div", { style: S.hint }, mystrings_1.strings.DnD_DragHint),
            draggableKeys.map(function (key, idx) {
                var isLocked = LOCKED_KEYS.has(key);
                var isDraggingThis = dragging === idx;
                var isDragOverThis = dragOver === idx && dragging !== idx;
                var showLabels = view !== 'card';
                return (React.createElement("div", tslib_1.__assign({ key: key }, (!isLocked
                    ? {
                        draggable: true,
                        onDragStart: function () { return handleDragStart(idx); },
                        onDragOver: function (e) {
                            return handleDragOver(e, idx);
                        },
                        onDrop: function () { return handleDrop(idx); },
                        onDragEnd: handleDragEnd,
                    }
                    : {}), { style: isLocked
                        ? S.lockedRow
                        : S.dragRow(isDraggingThis, isDragOverThis) }),
                    isLocked ? (React.createElement("svg", { width: "10", height: "16", viewBox: "0 0 10 16", fill: "#e1dfdd", style: S.handleLocked, "aria-hidden": true },
                        React.createElement("circle", { cx: "3", cy: "3", r: "1.5" }),
                        React.createElement("circle", { cx: "7", cy: "3", r: "1.5" }),
                        React.createElement("circle", { cx: "3", cy: "8", r: "1.5" }),
                        React.createElement("circle", { cx: "7", cy: "8", r: "1.5" }),
                        React.createElement("circle", { cx: "3", cy: "13", r: "1.5" }),
                        React.createElement("circle", { cx: "7", cy: "13", r: "1.5" }))) : (React.createElement(DragHandle, null)),
                    React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                        React.createElement("span", { style: S.fieldLabel }, defaultLabel(key)),
                        showLabels && !isLocked && (React.createElement("div", { style: S.labelRow }, supportedLanguages.map(function (lang) {
                            var _a;
                            return (React.createElement("div", { key: lang },
                                React.createElement("div", { style: S.labelCaption }, getLangName(lang)),
                                React.createElement("input", { type: "text", style: S.labelInput, defaultValue: ((_a = labels[key]) === null || _a === void 0 ? void 0 : _a[lang]) || '', placeholder: defaultLabel(key), onChange: function (e) { return updateLabelLocal(key, lang, e.target.value); } })));
                        })))),
                    React.createElement("button", { style: S.removeBtn, onClick: function () { return toggle(key); }, title: mystrings_1.strings.DnD_RemoveField, "aria-label": "".concat(mystrings_1.strings.DnD_RemoveField, ": ").concat(defaultLabel(key)) }, "\u00D7")));
            })))));
};
exports.default = DnDFieldSelector;
//# sourceMappingURL=DnDFieldSelector.js.map