"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Persona_1 = require("@fluentui/react/lib/Persona");
var Theme_1 = require("@fluentui/react/lib/Theme");
var mystrings_1 = require("../../loc/mystrings");
var teamsDeepLink_1 = require("../../../../utils/teamsDeepLink");
var formatUtils_1 = require("../../../../utils/formatUtils");
var LazyPersonaAvatar_1 = tslib_1.__importDefault(require("../shared/LazyPersonaAvatar"));
var TeamsIcon_1 = tslib_1.__importDefault(require("../shared/TeamsIcon"));
var OutlookIcon_1 = tslib_1.__importDefault(require("../shared/OutlookIcon"));
var MemberCard = function (_a) {
    var _b;
    var member = _a.member, cardFieldOrder = _a.cardFieldOrder, members = _a.members, onClick = _a.onClick;
    var fullName = "".concat(member.givenName || '', " ").concat(member.surname || '').trim() ||
        member.displayName;
    var theme = (0, Theme_1.useTheme)();
    var primaryColor = ((_b = theme === null || theme === void 0 ? void 0 : theme.palette) === null || _b === void 0 ? void 0 : _b.themePrimary) || '#1B7A6E';
    var showPhoto = cardFieldOrder.includes('photo');
    var showName = cardFieldOrder.includes('name');
    var showFirst = cardFieldOrder.includes('firstName');
    // Only photo/name/firstName are structurally fixed at the card top.
    // All other fields (including outlook/teams) respect the declared order.
    var STRUCTURAL = new Set(['photo', 'name', 'firstName']);
    var contentFields = cardFieldOrder.filter(function (k) { return !STRUCTURAL.has(k); });
    var ICON_KEYS = new Set(['outlook', 'teams']);
    var contentGroups = [];
    for (var _i = 0, contentFields_1 = contentFields; _i < contentFields_1.length; _i++) {
        var key = contentFields_1[_i];
        if (ICON_KEYS.has(key)) {
            var last = contentGroups[contentGroups.length - 1];
            if (last && last.type === 'icons') {
                last.keys.push(key);
            }
            else {
                contentGroups.push({ type: 'icons', keys: [key] });
            }
        }
        else {
            contentGroups.push({ type: 'text', key: key });
        }
    }
    var renderField = function (key) {
        var _a;
        var STANDARD = {
            email: function (m) { return m.email; },
            phone: function (m) { return m.mobilePhone; },
            jobTitle: function (m) { return m.jobTitle; },
            department: function (m) { return m.department; },
            officeLocation: function (m) { return m.officeLocation; },
        };
        if (key === 'manager') {
            if (!member.managerDisplayName)
                return null;
            var managerMember_1 = member.managerId
                ? members.find(function (m) { return m.id === member.managerId; })
                : undefined;
            return (React.createElement(React.Fragment, null,
                React.createElement("style", null, "\n            .spdir-mgr-link { display: inline-block; width: fit-content; position: relative; padding-bottom: 2px; }\n            .spdir-mgr-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 1px; background: currentColor; transform-origin: right; transform: scaleX(0); transition: transform 0.3s ease; }\n            .spdir-mgr-link:hover::after { transform: scaleX(1); }\n          "),
                React.createElement("span", { className: "spdir-mgr-link", role: managerMember_1 ? 'button' : undefined, tabIndex: managerMember_1 ? 0 : undefined, style: {
                        fontSize: 13,
                        color: managerMember_1 ? primaryColor : '#605e5c',
                        lineHeight: 1.4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: managerMember_1 ? 'pointer' : 'default',
                    }, onClick: managerMember_1
                        ? function (e) {
                            e.stopPropagation();
                            onClick(managerMember_1);
                        }
                        : undefined, onKeyDown: managerMember_1
                        ? function (e) {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                onClick(managerMember_1);
                            }
                        }
                        : undefined, title: managerMember_1 ? mystrings_1.strings.ViewProfile : undefined }, member.managerDisplayName)));
        }
        if (STANDARD[key]) {
            var val_1 = STANDARD[key](member);
            if (!val_1)
                return null;
            return (React.createElement("span", { style: {
                    fontSize: 13,
                    color: '#605e5c',
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                } }, val_1));
        }
        // EntraID / custom
        var val = (_a = member.customProperties) === null || _a === void 0 ? void 0 : _a[key];
        if (!val)
            return null;
        return (React.createElement("span", { style: {
                fontSize: 13,
                color: '#605e5c',
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            } }, val));
    };
    return (React.createElement("div", { style: {
            background: '#ffffff',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            overflow: 'hidden',
            transition: 'box-shadow 0.15s ease',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '16px',
            gap: 14,
        }, onClick: function () { return onClick(member); }, role: "button", tabIndex: 0, onKeyDown: function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(member);
            }
        }, onMouseEnter: function (e) {
            ;
            e.currentTarget.style.boxShadow =
                '0 4px 16px rgba(0,0,0,0.14)';
        }, onMouseLeave: function (e) {
            ;
            e.currentTarget.style.boxShadow =
                '0 2px 8px rgba(0,0,0,0.08)';
        }, "aria-label": "".concat(fullName, " - ").concat(mystrings_1.strings.ClickForDetails) },
        showPhoto && (React.createElement(LazyPersonaAvatar_1.default, { userId: member.id, displayName: member.displayName, givenName: member.givenName, size: Persona_1.PersonaSize.size100, coinSize: 80 })),
        React.createElement("div", { style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                minWidth: 0,
            } },
            (showName || showFirst) && (React.createElement("span", { style: {
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#201f1e',
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                } },
                showFirst && member.givenName ? member.givenName : '',
                showName && showFirst && member.givenName && member.surname
                    ? ' '
                    : '',
                showName && member.surname ? member.surname : '',
                !member.givenName && !member.surname ? fullName : '')),
            contentGroups.map(function (group, gi) {
                if (group.type === 'icons') {
                    var iconNodes = group.keys
                        .map(function (k) {
                        if (k === 'outlook' && member.email) {
                            return (React.createElement("a", { key: "outlook", href: (0, formatUtils_1.getMailtoLink)(member.email), target: "_blank", rel: "noopener noreferrer", title: mystrings_1.strings.SendEmail, "aria-label": mystrings_1.strings.SendEmail, onClick: function (e) { return e.stopPropagation(); }, style: { display: 'flex', alignItems: 'center' } },
                                React.createElement(OutlookIcon_1.default, { size: 20 })));
                        }
                        if (k === 'teams' && member.teamsId) {
                            return (React.createElement("a", { key: "teams", href: (0, teamsDeepLink_1.getTeamsDeepLink)(member.teamsId), target: "_blank", rel: "noopener noreferrer", title: mystrings_1.strings.ContactViaTeams, "aria-label": mystrings_1.strings.ContactViaTeams, onClick: function (e) { return e.stopPropagation(); }, style: { display: 'flex', alignItems: 'center' } },
                                React.createElement(TeamsIcon_1.default, { size: 20 })));
                        }
                        return null;
                    })
                        .filter(Boolean);
                    if (iconNodes.length === 0)
                        return null;
                    return (React.createElement("div", { key: "icons_".concat(gi), style: { display: 'flex', gap: 8, marginTop: 4 } }, iconNodes));
                }
                var node = renderField(group.key);
                if (!node)
                    return null;
                return React.createElement(React.Fragment, { key: group.key }, node);
            }))));
};
exports.default = MemberCard;
//# sourceMappingURL=MemberCard.js.map