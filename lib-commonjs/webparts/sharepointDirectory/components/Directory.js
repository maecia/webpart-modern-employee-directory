"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Theme_1 = require("@fluentui/react/lib/Theme");
var CardView_1 = tslib_1.__importDefault(require("./cardView/CardView"));
var ListView_1 = tslib_1.__importDefault(require("./listView/ListView"));
var MemberModal_1 = tslib_1.__importDefault(require("./modal/MemberModal"));
var Banner_1 = tslib_1.__importDefault(require("./Banner"));
var LoadingState_1 = tslib_1.__importDefault(require("./shared/LoadingState"));
var ErrorState_1 = tslib_1.__importDefault(require("./shared/ErrorState"));
var EmptyState_1 = tslib_1.__importDefault(require("./shared/EmptyState"));
var ErrorBoundary_1 = tslib_1.__importDefault(require("./shared/ErrorBoundary"));
var mystrings_1 = require("../loc/mystrings");
function applySortOrder(members, sortOrder) {
    var _a;
    var copy = tslib_1.__spreadArray([], members, true);
    switch (sortOrder) {
        case 'firstNameAsc':
            copy.sort(function (a, b) {
                return (a.givenName || a.displayName || '').localeCompare(b.givenName || b.displayName || '', 'fr', { sensitivity: 'base' });
            });
            break;
        case 'firstNameDesc':
            copy.sort(function (a, b) {
                return (b.givenName || b.displayName || '').localeCompare(a.givenName || a.displayName || '', 'fr', { sensitivity: 'base' });
            });
            break;
        case 'lastNameAsc':
            copy.sort(function (a, b) {
                return (a.surname || a.displayName || '').localeCompare(b.surname || b.displayName || '', 'fr', { sensitivity: 'base' });
            });
            break;
        case 'lastNameDesc':
            copy.sort(function (a, b) {
                return (b.surname || b.displayName || '').localeCompare(a.surname || a.displayName || '', 'fr', { sensitivity: 'base' });
            });
            break;
        case 'random':
            var rng = createSeededRng(members.length);
            for (var i = copy.length - 1; i > 0; i--) {
                var j = rng() % (i + 1);
                _a = [copy[j], copy[i]], copy[i] = _a[0], copy[j] = _a[1];
            }
            break;
    }
    return copy;
}
function createSeededRng(seed) {
    var s = seed;
    return function () {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return s >>> 0;
    };
}
function searchScore(member, query) {
    var score = 0;
    var fields = [
        member.displayName,
        member.givenName,
        member.surname,
        member.jobTitle,
        member.department,
        member.email,
        member.officeLocation,
        member.mobilePhone,
        member.managerDisplayName,
    ].filter(Boolean);
    var customProps = member.customProperties || {};
    var customValues = Object.values(customProps).filter(Boolean);
    var allValues = tslib_1.__spreadArray(tslib_1.__spreadArray([], fields, true), customValues, true);
    var lowerValues = allValues.map(function (v) { return v.toLowerCase(); });
    var q = query;
    for (var _i = 0, lowerValues_1 = lowerValues; _i < lowerValues_1.length; _i++) {
        var v = lowerValues_1[_i];
        if (v === q)
            score += 100;
        else if (v.startsWith(q))
            score += 50;
        else if (v.indexOf(q) !== -1)
            score += 10;
    }
    return score;
}
var Directory = function (_a) {
    var _b;
    var config = _a.config, members = _a.members, isLoading = _a.isLoading, error = _a.error, onRetry = _a.onRetry;
    var _c = React.useState(config.defaultView), view = _c[0], setView = _c[1];
    var _d = React.useState(''), searchQuery = _d[0], setSearchQuery = _d[1];
    var _e = React.useState({}), filterValues = _e[0], setFilterValues = _e[1];
    var _f = React.useState(null), selectedMember = _f[0], setSelectedMember = _f[1];
    var theme = (0, Theme_1.useTheme)();
    var primaryColor = ((_b = theme === null || theme === void 0 ? void 0 : theme.palette) === null || _b === void 0 ? void 0 : _b.themePrimary) || '#1B7A6E';
    React.useEffect(function () {
        var id = 'spdir-no-outline';
        if (document.getElementById(id))
            return;
        var style = document.createElement('style');
        style.id = id;
        // Scope to .spdir-root so we don't affect the rest of SharePoint.
        // Cover :focus, :focus-visible and :focus-within (wrapper divs).
        // Use ID selector (specificity 1,0,0) to override SharePoint's !important rules.
        style.textContent = [
            '#spdir-root *:focus,',
            '#spdir-root *:focus-visible,',
            '#spdir-root *:focus-within,',
            '#spdir-root:focus-within',
            '{outline:none!important;box-shadow:none!important;}',
        ].join('');
        document.head.appendChild(style);
        return function () {
            var el = document.getElementById(id);
            if (el && el.parentNode)
                el.parentNode.removeChild(el);
        };
    }, []);
    React.useEffect(function () {
        setView(config.defaultView);
    }, [config.defaultView]);
    var filteredMembers = React.useMemo(function () {
        var result = members.filter(function (m) { return m.isVisible && (m.givenName || m.surname); });
        if (searchQuery.trim()) {
            var query_1 = searchQuery.toLowerCase();
            result = result
                .filter(function (m) {
                var fields = [
                    m.displayName,
                    m.givenName,
                    m.surname,
                    m.jobTitle,
                    m.department,
                    m.email,
                    m.officeLocation,
                    m.mobilePhone,
                    m.managerDisplayName,
                ];
                var customValues = Object.values(m.customProperties || {});
                return tslib_1.__spreadArray(tslib_1.__spreadArray([], fields, true), customValues, true).some(function (v) { return v && v.toLowerCase().indexOf(query_1) !== -1; });
            })
                .sort(function (a, b) { return searchScore(b, query_1) - searchScore(a, query_1); });
        }
        if (config.filters.length > 0) {
            config.filters.forEach(function (filter) {
                var values = filterValues[filter.fieldName];
                if (values && values.length > 0) {
                    result = result.filter(function (m) {
                        var _a;
                        var fieldValue = (_a = m[filter.fieldName]) !== null && _a !== void 0 ? _a : (m.customProperties && m.customProperties[filter.fieldName]);
                        return values.includes(fieldValue);
                    });
                }
            });
        }
        if (!searchQuery.trim()) {
            result = applySortOrder(tslib_1.__spreadArray([], result, true), config.sortOrder);
        }
        return result;
    }, [members, searchQuery, filterValues, config.filters, config.sortOrder]);
    var resultCount = filteredMembers.length;
    var handleFilterChange = function (fieldName, value) {
        setFilterValues(function (prev) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[fieldName] = value, _a)));
        });
    };
    if (isLoading) {
        return React.createElement(LoadingState_1.default, null);
    }
    if (error) {
        return React.createElement(ErrorState_1.default, { message: error, onRetry: onRetry });
    }
    return (React.createElement(ErrorBoundary_1.default, null,
        React.createElement("div", { id: "spdir-root", role: "region", "aria-label": mystrings_1.strings.DirectoryRegionLabel, "aria-live": "polite", style: { backgroundColor: '#faf9f8', minHeight: '100%' } },
            React.createElement(Banner_1.default, { searchQuery: searchQuery, onSearchChange: setSearchQuery, filters: config.filters, members: members, filterValues: filterValues, onFilterChange: handleFilterChange, resultCount: resultCount, activeView: view, onViewChange: setView, filteredMembers: filteredMembers, listFieldOrder: config.listFieldOrder, listFieldLabels: config.listFieldLabels }),
            React.createElement("div", { key: view, style: {
                    animation: 'spdir-fadein 0.18s ease',
                } },
                React.createElement("style", null, "\n          @keyframes spdir-fadein {\n            from { opacity: 0; transform: translateY(6px); }\n            to   { opacity: 1; transform: translateY(0); }\n          }\n          @media (prefers-reduced-motion: reduce) {\n            *, *::before, *::after {\n              animation-duration: 0.01ms !important;\n              animation-iteration-count: 1 !important;\n              transition-duration: 0.01ms !important;\n            }\n          }\n        "),
                filteredMembers.length === 0 ? (React.createElement(EmptyState_1.default, null)) : view === 'card' ? (React.createElement(CardView_1.default, { members: filteredMembers, cardFieldOrder: config.cardFieldOrder, onMemberClick: setSelectedMember })) : (React.createElement(ListView_1.default, { members: filteredMembers, listFieldOrder: config.listFieldOrder, listFieldLabels: config.listFieldLabels, onMemberClick: setSelectedMember }))),
            React.createElement(MemberModal_1.default, { member: selectedMember, members: members, modalFieldOrder: config.modalFieldOrder, modalFieldLabels: config.modalFieldLabels, onDismiss: function () { return setSelectedMember(null); }, onMemberClick: setSelectedMember }))));
};
exports.default = Directory;
//# sourceMappingURL=Directory.js.map