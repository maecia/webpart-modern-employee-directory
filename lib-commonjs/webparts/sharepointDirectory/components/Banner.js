"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Text_1 = require("@fluentui/react/lib/Text");
var Theme_1 = require("@fluentui/react/lib/Theme");
var mystrings_1 = require("../loc/mystrings");
var SearchBar_1 = tslib_1.__importDefault(require("./search/SearchBar"));
var FilterBar_1 = tslib_1.__importDefault(require("./search/FilterBar"));
var CsvExport_1 = tslib_1.__importDefault(require("./export/CsvExport"));
var Banner = function (_a) {
    var _b;
    var searchQuery = _a.searchQuery, onSearchChange = _a.onSearchChange, filters = _a.filters, members = _a.members, filterValues = _a.filterValues, onFilterChange = _a.onFilterChange, resultCount = _a.resultCount, activeView = _a.activeView, onViewChange = _a.onViewChange, filteredMembers = _a.filteredMembers, listFieldOrder = _a.listFieldOrder, listFieldLabels = _a.listFieldLabels;
    var theme = (0, Theme_1.useTheme)();
    var primaryColor = ((_b = theme === null || theme === void 0 ? void 0 : theme.palette) === null || _b === void 0 ? void 0 : _b.themePrimary) || '#1B7A6E';
    return (React.createElement("div", { style: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
            padding: '12px 24px',
            minHeight: 64,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #edebe9',
            boxSizing: 'border-box',
        } },
        React.createElement(SearchBar_1.default, { value: searchQuery, onChange: onSearchChange }),
        filters.length > 0 && (React.createElement(FilterBar_1.default, { filters: filters, members: members, values: filterValues, onChange: onFilterChange })),
        React.createElement("div", { style: { flex: 1, minWidth: 16 } }),
        React.createElement(Text_1.Text, { variant: "small", styles: { root: { whiteSpace: 'nowrap', color: '#605e5c' } } },
            mystrings_1.strings.ResultsLabel,
            " ",
            resultCount,
            ' ',
            resultCount <= 1
                ? mystrings_1.strings.CollaboratorSingular
                : mystrings_1.strings.CollaboratorPlural),
        React.createElement("div", { style: {
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e0e0e0',
                borderRadius: 20,
                padding: 3,
                gap: 2,
                backgroundColor: '#ffffff',
                flexShrink: 0,
            } },
            React.createElement("button", { onClick: function () { return onViewChange('card'); }, title: mystrings_1.strings.ViewTrombinoscope, "aria-label": mystrings_1.strings.ViewTrombinoscope, "aria-pressed": activeView === 'card', style: {
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: activeView === 'card' ? primaryColor : 'transparent',
                    color: activeView === 'card' ? '#ffffff' : '#605e5c',
                    cursor: 'pointer',
                    border: 'none',
                    padding: 0,
                    flexShrink: 0,
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                } },
                React.createElement("svg", { width: "15", height: "15", viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true" },
                    React.createElement("rect", { x: "1", y: "1", width: "6", height: "6", rx: "1" }),
                    React.createElement("rect", { x: "9", y: "1", width: "6", height: "6", rx: "1" }),
                    React.createElement("rect", { x: "1", y: "9", width: "6", height: "6", rx: "1" }),
                    React.createElement("rect", { x: "9", y: "9", width: "6", height: "6", rx: "1" }))),
            React.createElement("button", { onClick: function () { return onViewChange('list'); }, title: mystrings_1.strings.ViewList, "aria-label": mystrings_1.strings.ViewList, "aria-pressed": activeView === 'list', style: {
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: activeView === 'list' ? primaryColor : 'transparent',
                    color: activeView === 'list' ? '#ffffff' : '#605e5c',
                    cursor: 'pointer',
                    border: 'none',
                    padding: 0,
                    flexShrink: 0,
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                } },
                React.createElement("svg", { width: "15", height: "15", viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true" },
                    React.createElement("rect", { x: "1", y: "2", width: "14", height: "2", rx: "1" }),
                    React.createElement("rect", { x: "1", y: "7", width: "14", height: "2", rx: "1" }),
                    React.createElement("rect", { x: "1", y: "12", width: "14", height: "2", rx: "1" })))),
        React.createElement(CsvExport_1.default, { members: filteredMembers, listFieldOrder: listFieldOrder, listFieldLabels: listFieldLabels })));
};
exports.default = Banner;
//# sourceMappingURL=Banner.js.map