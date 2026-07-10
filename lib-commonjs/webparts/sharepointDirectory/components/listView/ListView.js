"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Persona_1 = require("@fluentui/react/lib/Persona");
var Theme_1 = require("@fluentui/react/lib/Theme");
var DirectoryConfig_1 = require("../../../../models/DirectoryConfig");
var usePagination_1 = require("../../../../hooks/usePagination");
var teamsDeepLink_1 = require("../../../../utils/teamsDeepLink");
var formatUtils_1 = require("../../../../utils/formatUtils");
var mystrings_1 = require("../../loc/mystrings");
var PersonaAvatar_1 = tslib_1.__importDefault(require("../shared/PersonaAvatar"));
var TeamsIcon_1 = tslib_1.__importDefault(require("../shared/TeamsIcon"));
var OutlookIcon_1 = tslib_1.__importDefault(require("../shared/OutlookIcon"));
var headerCellStyle = {
    padding: '10px 16px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 600,
    color: '#605e5c',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    borderBottom: '1px solid #edebe9',
    userSelect: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    backgroundColor: '#F8F9FB',
};
var cellStyle = {
    padding: '10px 16px',
    fontSize: 14,
    color: '#201f1e',
    verticalAlign: 'middle',
};
var ListView = function (_a) {
    var _b;
    var members = _a.members, listFieldOrder = _a.listFieldOrder, listFieldLabels = _a.listFieldLabels, onMemberClick = _a.onMemberClick;
    var _c = (0, usePagination_1.usePagination)(members, 'list'), visibleItems = _c.visibleItems, hasMore = _c.hasMore, loadMore = _c.loadMore;
    var theme = (0, Theme_1.useTheme)();
    var primaryColor = ((_b = theme === null || theme === void 0 ? void 0 : theme.palette) === null || _b === void 0 ? void 0 : _b.themePrimary) || '#1B7A6E';
    var _d = React.useState(false), loadMoreHovered = _d[0], setLoadMoreHovered = _d[1];
    var _e = React.useState({
        key: 'displayName',
        descending: false,
    }), sortState = _e[0], setSortState = _e[1];
    var _f = React.useState(null), hoveredCol = _f[0], setHoveredCol = _f[1];
    var columns = React.useMemo(function () {
        var cols = [];
        var nameGroupAdded = false;
        var showFirstName = listFieldOrder.includes('firstName');
        var showLastName = listFieldOrder.includes('name');
        var _loop_1 = function (key) {
            switch (key) {
                case 'photo':
                    cols.push({
                        key: 'photo',
                        renderHeader: function () { return null; },
                        renderCell: function (m) { return (React.createElement(PersonaAvatar_1.default, { photoUrl: m.photoUrl, displayName: m.displayName, givenName: m.givenName, size: Persona_1.PersonaSize.size32 })); },
                        headerStyle: tslib_1.__assign(tslib_1.__assign({}, headerCellStyle), { cursor: 'default', width: 44, padding: '10px 0 10px 16px' }),
                        cellStyle: tslib_1.__assign(tslib_1.__assign({}, cellStyle), { width: 44, padding: '10px 0 10px 16px' }),
                    });
                    break;
                case 'name':
                case 'firstName':
                    if (!nameGroupAdded) {
                        nameGroupAdded = true;
                        cols.push({
                            key: 'name_group',
                            sortKey: 'displayName',
                            renderHeader: function () {
                                return listFieldLabels['name'] || mystrings_1.strings.HeaderCollaborator;
                            },
                            renderCell: function (m) {
                                var fullName = "".concat(m.givenName || '', " ").concat(m.surname || '').trim() ||
                                    m.displayName;
                                if (showFirstName && showLastName)
                                    return React.createElement("span", { style: { fontWeight: 500 } }, fullName);
                                if (showFirstName)
                                    return (React.createElement("span", { style: { fontWeight: 500 } }, m.givenName || ''));
                                return (React.createElement("span", { style: { fontWeight: 500 } }, m.surname || m.displayName));
                            },
                        });
                    }
                    break;
                case 'jobTitle':
                    cols.push({
                        key: 'jobTitle',
                        sortKey: 'jobTitle',
                        renderHeader: function () {
                            return listFieldLabels['jobTitle'] || mystrings_1.strings.HeaderJobTitle;
                        },
                        renderCell: function (m) { return m.jobTitle || ''; },
                    });
                    break;
                case 'email':
                    cols.push({
                        key: 'email',
                        sortKey: 'email',
                        renderHeader: function () { return listFieldLabels['email'] || mystrings_1.strings.HeaderEmail; },
                        renderCell: function (m) { return m.email || ''; },
                    });
                    break;
                case 'phone':
                    cols.push({
                        key: 'phone',
                        sortKey: 'mobilePhone',
                        renderHeader: function () { return listFieldLabels['phone'] || mystrings_1.strings.HeaderPhone; },
                        renderCell: function (m) { return m.mobilePhone || ''; },
                    });
                    break;
                case 'department':
                    cols.push({
                        key: 'department',
                        sortKey: 'department',
                        renderHeader: function () {
                            return listFieldLabels['department'] || mystrings_1.strings.HeaderDepartment;
                        },
                        renderCell: function (m) { return m.department || ''; },
                    });
                    break;
                case 'officeLocation':
                    cols.push({
                        key: 'officeLocation',
                        sortKey: 'officeLocation',
                        renderHeader: function () {
                            return listFieldLabels['officeLocation'] || mystrings_1.strings.HeaderLocation;
                        },
                        renderCell: function (m) { return m.officeLocation || ''; },
                    });
                    break;
                case 'manager':
                    cols.push({
                        key: 'manager',
                        sortKey: 'managerDisplayName',
                        renderHeader: function () { return mystrings_1.strings.HeaderManager; },
                        renderCell: function (m) {
                            var mgr = m.managerId
                                ? members.find(function (x) { return x.id === m.managerId; })
                                : undefined;
                            if (mgr) {
                                return (React.createElement("span", { className: "spdir-mgr-link", style: { color: primaryColor, cursor: 'pointer' }, onClick: function (e) {
                                        e.stopPropagation();
                                        onMemberClick(mgr);
                                    }, title: mystrings_1.strings.ViewProfile }, m.managerDisplayName || ''));
                            }
                            return m.managerDisplayName || '';
                        },
                    });
                    break;
                case 'outlook':
                    cols.push({
                        key: 'outlook',
                        renderHeader: function () { return null; },
                        renderCell: function (m) {
                            return m.email ? (React.createElement("a", { href: (0, formatUtils_1.getMailtoLink)(m.email), target: "_blank", rel: "noopener noreferrer", title: mystrings_1.strings.SendEmail, "aria-label": mystrings_1.strings.SendEmail, onClick: function (e) { return e.stopPropagation(); }, style: { display: 'flex', alignItems: 'center' } },
                                React.createElement(OutlookIcon_1.default, { size: 20 }))) : null;
                        },
                        headerStyle: tslib_1.__assign(tslib_1.__assign({}, headerCellStyle), { cursor: 'default', width: 48 }),
                        cellStyle: tslib_1.__assign(tslib_1.__assign({}, cellStyle), { padding: '10px 8px' }),
                    });
                    break;
                case 'teams':
                    cols.push({
                        key: 'teams',
                        renderHeader: function () { return null; },
                        renderCell: function (m) {
                            return m.teamsId ? (React.createElement("button", { style: {
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 4,
                                    borderRadius: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                }, title: mystrings_1.strings.ContactViaTeams, "aria-label": mystrings_1.strings.ContactViaTeams, onClick: function (e) {
                                    e.stopPropagation();
                                    window.open((0, teamsDeepLink_1.getTeamsDeepLink)(m.teamsId), '_blank');
                                } },
                                React.createElement(TeamsIcon_1.default, { size: 20 }))) : null;
                        },
                        headerStyle: tslib_1.__assign(tslib_1.__assign({}, headerCellStyle), { cursor: 'default', width: 48 }),
                        cellStyle: tslib_1.__assign(tslib_1.__assign({}, cellStyle), { padding: '10px 8px' }),
                    });
                    break;
                default: {
                    // Custom / EntraID field
                    var label_1 = listFieldLabels[key] || (0, DirectoryConfig_1.getEntraFieldLabel)(key);
                    cols.push({
                        key: key,
                        sortKey: key,
                        renderHeader: function () { return label_1; },
                        renderCell: function (m) { var _a; return ((_a = m.customProperties) === null || _a === void 0 ? void 0 : _a[key]) || ''; },
                    });
                    break;
                }
            }
        };
        for (var _i = 0, listFieldOrder_1 = listFieldOrder; _i < listFieldOrder_1.length; _i++) {
            var key = listFieldOrder_1[_i];
            _loop_1(key);
        }
        return cols;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listFieldOrder, listFieldLabels, members, primaryColor]);
    // ── Sorting ───────────────────────────────────────────────────────────────
    var sorted = React.useMemo(function () {
        var result = tslib_1.__spreadArray([], visibleItems, true);
        result.sort(function (a, b) {
            var _a, _b;
            var aVal;
            var bVal;
            var k = sortState.key;
            if (k === 'displayName') {
                aVal = "".concat(a.givenName || '', " ").concat(a.surname || '').trim() || a.displayName;
                bVal = "".concat(b.givenName || '', " ").concat(b.surname || '').trim() || b.displayName;
            }
            else if (a[k] !== undefined) {
                aVal = String(a[k] || '');
                bVal = String(b[k] || '');
            }
            else {
                aVal = ((_a = a.customProperties) === null || _a === void 0 ? void 0 : _a[k]) || '';
                bVal = ((_b = b.customProperties) === null || _b === void 0 ? void 0 : _b[k]) || '';
            }
            var cmp = aVal.localeCompare(bVal, 'fr', { sensitivity: 'base' });
            return sortState.descending ? -cmp : cmp;
        });
        return result;
    }, [visibleItems, sortState]);
    var toggleSort = function (key) {
        setSortState(function (prev) {
            return prev.key === key
                ? { key: key, descending: !prev.descending }
                : { key: key, descending: false };
        });
    };
    var sortIndicator = function (key) {
        var isActive = sortState.key === key;
        var isHovered = hoveredCol === key;
        return (React.createElement("span", { style: {
                display: 'inline-block',
                width: 14,
                marginLeft: 4,
                textAlign: 'center',
                opacity: isActive ? 0.8 : 0.4,
            } }, isActive ? (sortState.descending ? '↓' : '↑') : isHovered ? '↕' : ''));
    };
    // ── Render ────────────────────────────────────────────────────────────────
    return (React.createElement("div", { style: { padding: '8px 24px 32px' } },
        React.createElement("style", null, "\n        .spdir-mgr-link {\n          display: inline-block;\n          width: fit-content;\n          position: relative;\n          padding-bottom: 2px;\n        }\n        .spdir-mgr-link::after {\n          content: '';\n          position: absolute;\n          bottom: 0; left: 0;\n          width: 100%; height: 1px;\n          background: currentColor;\n          transform-origin: right;\n          transform: scaleX(0);\n          transition: transform 0.3s ease;\n        }\n        .spdir-mgr-link:hover::after { transform: scaleX(1); }\n      "),
        React.createElement("div", { style: { overflowX: 'auto' } },
            React.createElement("table", { style: {
                    width: '100%',
                    borderCollapse: 'collapse',
                    backgroundColor: '#ffffff',
                } },
                React.createElement("caption", { style: {
                        border: 0,
                        clip: 'rect(0 0 0 0)',
                        height: 1,
                        margin: -1,
                        overflow: 'hidden',
                        padding: 0,
                        position: 'absolute',
                        width: 1,
                        whiteSpace: 'nowrap',
                    } }, mystrings_1.strings.ResultsLabel),
                React.createElement("thead", null,
                    React.createElement("tr", null, columns.map(function (col) {
                        var header = col.renderHeader();
                        if (!col.sortKey || !header) {
                            return (React.createElement("th", { key: col.key, scope: "col", style: col.headerStyle || headerCellStyle }, header));
                        }
                        var sk = col.sortKey;
                        return (React.createElement("th", { key: col.key, scope: "col", style: tslib_1.__assign(tslib_1.__assign({}, (col.headerStyle || headerCellStyle)), { backgroundColor: hoveredCol === sk ? '#eef0f4' : '#F8F9FB', transition: 'background-color 0.15s ease' }), onClick: function () { return toggleSort(sk); }, onMouseEnter: function () { return setHoveredCol(sk); }, onMouseLeave: function () { return setHoveredCol(null); } },
                            header,
                            sortIndicator(sk)));
                    }))),
                React.createElement("tbody", null, sorted.map(function (member) { return (React.createElement("tr", { key: member.id, tabIndex: 0, role: "button", "aria-label": "".concat((member.givenName || ''), " ").concat((member.surname || '')).trim() || member.displayName, onClick: function () { return onMemberClick(member); }, onKeyDown: function (e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onMemberClick(member);
                        }
                    }, style: { cursor: 'pointer', borderBottom: '1px solid #f3f2f1' }, onMouseEnter: function (e) {
                        ;
                        e.currentTarget.style.backgroundColor =
                            '#faf9f8';
                    }, onMouseLeave: function (e) {
                        ;
                        e.currentTarget.style.backgroundColor =
                            'transparent';
                    } }, columns.map(function (col) { return (React.createElement("td", { key: col.key, style: col.cellStyle || cellStyle }, col.renderCell(member))); }))); })))),
        hasMore && (React.createElement("div", { style: { display: 'flex', justifyContent: 'center', marginTop: 24 } },
            React.createElement("button", { onClick: loadMore, onMouseEnter: function () { return setLoadMoreHovered(true); }, onMouseLeave: function () { return setLoadMoreHovered(false); }, style: {
                    padding: '8px 24px',
                    borderRadius: 20,
                    border: "1px solid ".concat(primaryColor),
                    background: loadMoreHovered ? '#f3f2f1' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: primaryColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'background 0.15s ease',
                } },
                React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", "aria-hidden": "true" },
                    React.createElement("path", { d: "M7 1a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H8v4a1 1 0 1 1-2 0V8H2a1 1 0 1 1 0-2h4V2a1 1 0 0 1 1-1z" })),
                mystrings_1.strings.LoadMore)))));
};
exports.default = ListView;
//# sourceMappingURL=ListView.js.map