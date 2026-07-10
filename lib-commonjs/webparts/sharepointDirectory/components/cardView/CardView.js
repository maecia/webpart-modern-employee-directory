"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Theme_1 = require("@fluentui/react/lib/Theme");
var usePagination_1 = require("../../../../hooks/usePagination");
var mystrings_1 = require("../../loc/mystrings");
var MemberCard_1 = tslib_1.__importDefault(require("./MemberCard"));
var CardView = function (_a) {
    var _b;
    var members = _a.members, cardFieldOrder = _a.cardFieldOrder, onMemberClick = _a.onMemberClick;
    var _c = (0, usePagination_1.usePagination)(members, 'card'), visibleItems = _c.visibleItems, hasMore = _c.hasMore, loadMore = _c.loadMore;
    var theme = (0, Theme_1.useTheme)();
    var primaryColor = ((_b = theme === null || theme === void 0 ? void 0 : theme.palette) === null || _b === void 0 ? void 0 : _b.themePrimary) || '#1B7A6E';
    var _d = React.useState(false), loadMoreHovered = _d[0], setLoadMoreHovered = _d[1];
    return (React.createElement("div", { style: { padding: '16px 24px 32px' } },
        React.createElement("div", { style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(282px, 1fr))',
                gap: 16,
                width: '100%',
            } }, visibleItems.map(function (member) { return (React.createElement(MemberCard_1.default, { key: member.id, member: member, cardFieldOrder: cardFieldOrder, members: members, onClick: onMemberClick })); })),
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
exports.default = CardView;
//# sourceMappingURL=CardView.js.map