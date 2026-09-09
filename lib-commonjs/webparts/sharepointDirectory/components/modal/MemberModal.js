"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Modal_1 = require("@fluentui/react/lib/Modal");
var Persona_1 = require("@fluentui/react/lib/Persona");
var Theme_1 = require("@fluentui/react/lib/Theme");
var DirectoryConfig_1 = require("../../../../models/DirectoryConfig");
var teamsDeepLink_1 = require("../../../../utils/teamsDeepLink");
var formatUtils_1 = require("../../../../utils/formatUtils");
var mystrings_1 = require("../../loc/mystrings");
var LazyPersonaAvatar_1 = tslib_1.__importDefault(require("../shared/LazyPersonaAvatar"));
var TeamsIcon_1 = tslib_1.__importDefault(require("../shared/TeamsIcon"));
var OutlookIcon_1 = tslib_1.__importDefault(require("../shared/OutlookIcon"));
var Divider = function () { return (React.createElement("hr", { style: {
        border: 'none',
        borderTop: '1px solid #edebe9',
        margin: '12px 0',
        width: '100%',
    } })); };
/** Uniform label+value row used for every detail field */
var FieldRow = function (_a) {
    var label = _a.label, value = _a.value, link = _a.link;
    return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 2 } },
        React.createElement("span", { style: { fontSize: 12, color: '#605e5c' } }, label),
        link ? (React.createElement("a", { href: link, target: "_blank", rel: "noopener noreferrer", style: { fontSize: 14, color: '#201f1e', textDecoration: 'none' }, onClick: function (e) { return e.stopPropagation(); } }, value)) : (React.createElement("span", { style: { fontSize: 14, color: '#201f1e' } }, value))));
};
var MemberModal = function (_a) {
    var _b;
    var member = _a.member, members = _a.members, modalFieldOrder = _a.modalFieldOrder, modalFieldLabels = _a.modalFieldLabels, onDismiss = _a.onDismiss, onMemberClick = _a.onMemberClick;
    var theme = (0, Theme_1.useTheme)();
    var primaryColor = ((_b = theme === null || theme === void 0 ? void 0 : theme.palette) === null || _b === void 0 ? void 0 : _b.themePrimary) || '#1B7A6E';
    if (!member)
        return null;
    var fullName = "".concat(member.givenName || '', " ").concat(member.surname || '').trim() ||
        member.displayName;
    var managerMember = member.managerId
        ? members.find(function (m) { return m.id === member.managerId; })
        : undefined;
    // Fields shown in the fixed header (position-based, not ordered)
    var showPhoto = modalFieldOrder.includes('photo');
    var showName = modalFieldOrder.includes('name') || modalFieldOrder.includes('firstName');
    var showFirstName = modalFieldOrder.includes('firstName');
    var showLastName = modalFieldOrder.includes('name');
    // Detail fields: everything except photo / name / firstName (rendered in declared order)
    var HEADER = new Set(['photo', 'name', 'firstName']);
    var detailFields = modalFieldOrder.filter(function (k) { return !HEADER.has(k); });
    var DETAIL_FIELDS = new Set([
        'jobTitle',
        'email',
        'phone',
        'department',
        'officeLocation',
        'manager',
    ]);
    var ACTION_FIELDS = new Set(['outlook', 'teams']);
    var hasDetailSection = detailFields.some(function (k) {
        var _a;
        if (ACTION_FIELDS.has(k))
            return false;
        switch (k) {
            case 'email':
                return !!member.email;
            case 'phone':
                return !!member.mobilePhone;
            case 'department':
                return !!member.department;
            case 'officeLocation':
                return !!member.officeLocation;
            case 'manager':
                return !!member.managerDisplayName;
            case 'jobTitle':
                return !!member.jobTitle;
            default:
                return !!((_a = member.customProperties) === null || _a === void 0 ? void 0 : _a[k]);
        }
    });
    var hasActionButtons = (detailFields.includes('outlook') && !!member.email) ||
        (detailFields.includes('teams') && !!member.teamsId);
    return (React.createElement(Modal_1.Modal, { isOpen: !!member, onDismiss: onDismiss, isBlocking: false, titleAriaId: "spdir-modal-title", styles: {
            main: {
                maxWidth: 480,
                minWidth: 340,
                borderRadius: 12,
                padding: 0,
                overflow: 'hidden',
            },
        } },
        React.createElement("div", { style: {
                position: 'relative',
                padding: '32px 28px 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: 'spdir-modal-in 0.2s ease',
            } },
            React.createElement("style", null, "\n          @keyframes spdir-modal-in {\n            from { opacity: 0; }\n            to   { opacity: 1; }\n          }\n          .spdir-mgr-link {\n            display: inline-block;\n            width: fit-content;\n            align-self: flex-start;\n            position: relative;\n            padding-bottom: 2px;\n          }\n          .spdir-mgr-link::after {\n            content: '';\n            position: absolute;\n            bottom: 0;\n            left: 0;\n            width: 100%;\n            height: 1px;\n            background: currentColor;\n            transform-origin: right;\n            transform: scaleX(0);\n            transition: transform 0.3s ease;\n          }\n          .spdir-mgr-link:hover::after {\n            transform: scaleX(1);\n          }\n        "),
            React.createElement("button", { onClick: onDismiss, "aria-label": mystrings_1.strings.CloseModal, style: {
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 6,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#605e5c',
                } },
                React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "currentColor", "aria-hidden": "true" },
                    React.createElement("path", { d: "M.293.293a1 1 0 0 1 1.414 0L6 4.586 10.293.293a1 1 0 1 1 1.414 1.414L7.414 6l4.293 4.293a1 1 0 0 1-1.414 1.414L6 7.414l-4.293 4.293A1 1 0 0 1 .293 10.707L4.586 6 .293 1.707A1 1 0 0 1 .293.293Z" }))),
            showPhoto && (React.createElement(LazyPersonaAvatar_1.default, { userId: member.id, displayName: member.displayName, givenName: member.givenName, size: Persona_1.PersonaSize.size100, coinSize: 80, imageShouldFadeIn: false })),
            showName && (React.createElement("h2", { id: "spdir-modal-title", style: {
                    margin: '16px 0 4px',
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#201f1e',
                    textAlign: 'center',
                } },
                showFirstName && member.givenName ? member.givenName : '',
                showFirstName && showLastName && member.givenName && member.surname
                    ? ' '
                    : '',
                showLastName && member.surname ? member.surname : '',
                !member.givenName && !member.surname ? fullName : '')),
            hasDetailSection && (React.createElement(React.Fragment, null,
                React.createElement(Divider, null),
                React.createElement("div", { style: {
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                    } }, detailFields.map(function (key) {
                    var _a;
                    if (ACTION_FIELDS.has(key))
                        return null;
                    switch (key) {
                        case 'jobTitle':
                            return member.jobTitle ? (React.createElement(FieldRow, { key: key, label: mystrings_1.strings.FieldJobTitle, value: member.jobTitle })) : null;
                        case 'email':
                            return member.email ? (React.createElement(FieldRow, { key: key, label: mystrings_1.strings.FieldEmail, value: member.email, link: (0, formatUtils_1.getMailtoLink)(member.email) })) : null;
                        case 'phone':
                            return member.mobilePhone ? (React.createElement(FieldRow, { key: key, label: mystrings_1.strings.FieldPhone, value: member.mobilePhone })) : null;
                        case 'department':
                            return member.department ? (React.createElement(FieldRow, { key: key, label: mystrings_1.strings.LabelDepartment, value: member.department })) : null;
                        case 'officeLocation':
                            return member.officeLocation ? (React.createElement(FieldRow, { key: key, label: mystrings_1.strings.LabelLocation, value: member.officeLocation })) : null;
                        case 'manager':
                            return member.managerDisplayName ? (React.createElement("div", { key: key, style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                } },
                                React.createElement("span", { style: {
                                        fontSize: 12,
                                        color: '#605e5c',
                                        marginBottom: 4,
                                    } }, mystrings_1.strings.LabelManager),
                                managerMember ? (React.createElement("span", { className: "spdir-mgr-link", role: "button", tabIndex: 0, style: {
                                        fontSize: 14,
                                        color: primaryColor,
                                        cursor: 'pointer',
                                    }, onClick: function (e) {
                                        e.stopPropagation();
                                        onDismiss();
                                        setTimeout(function () { return onMemberClick(managerMember); }, 100);
                                    }, onKeyDown: function (e) {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onDismiss();
                                            setTimeout(function () { return onMemberClick(managerMember); }, 100);
                                        }
                                    } }, member.managerDisplayName)) : (React.createElement("span", { style: { fontSize: 14, color: '#201f1e' } }, member.managerDisplayName)))) : null;
                        default: {
                            var val = (_a = member.customProperties) === null || _a === void 0 ? void 0 : _a[key];
                            if (!val)
                                return null;
                            var label = modalFieldLabels[key] || (0, DirectoryConfig_1.getEntraFieldLabel)(key);
                            return React.createElement(FieldRow, { key: key, label: label, value: val });
                        }
                    }
                })))),
            hasActionButtons && (React.createElement("div", { style: {
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    marginTop: 16,
                } },
                detailFields.includes('teams') && member.teamsId && (React.createElement("button", { onClick: function () {
                        return window.open((0, teamsDeepLink_1.getTeamsDeepLink)(member.teamsId), '_blank');
                    }, onMouseEnter: function (e) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }, onMouseLeave: function (e) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }, style: {
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        padding: '12px 20px',
                        borderRadius: 30,
                        border: '1.5px solid #6264A7',
                        background: 'transparent',
                        color: '#6264A7',
                        fontSize: 15,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                    } },
                    React.createElement(TeamsIcon_1.default, { size: 20 }),
                    mystrings_1.strings.ContactViaTeams)),
                detailFields.includes('outlook') && member.email && (React.createElement("button", { onClick: function () {
                        return window.open((0, formatUtils_1.getMailtoLink)(member.email), '_blank');
                    }, onMouseEnter: function (e) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }, onMouseLeave: function (e) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }, style: {
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        padding: '12px 20px',
                        borderRadius: 30,
                        border: '1.5px solid #0078D4',
                        background: 'transparent',
                        color: '#0078D4',
                        fontSize: 15,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                    } },
                    React.createElement(OutlookIcon_1.default, { size: 20 }),
                    mystrings_1.strings.SendEmail)))))));
};
exports.default = MemberModal;
//# sourceMappingURL=MemberModal.js.map