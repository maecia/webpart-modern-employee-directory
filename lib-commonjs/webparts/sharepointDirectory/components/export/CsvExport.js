"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var CsvService_1 = require("../../../../services/CsvService");
var mystrings_1 = require("../../loc/mystrings");
var DirectoryConfig_1 = require("../../../../models/DirectoryConfig");
// Keys that have no exportable text value — skip in CSV
var SKIP_KEYS = new Set(['photo', 'outlook', 'teams']);
/** Read the value of a field from a Member object */
function getMemberFieldValue(m, key) {
    switch (key) {
        case 'firstName':
            return m.givenName || '';
        case 'name':
            return m.surname || '';
        case 'email':
            return m.email || '';
        case 'phone':
            return m.mobilePhone || '';
        case 'jobTitle':
            return m.jobTitle || '';
        case 'department':
            return m.department || '';
        case 'officeLocation':
            return m.officeLocation || '';
        case 'manager':
            return m.managerDisplayName || '';
        default:
            return (m.customProperties && m.customProperties[key]) || '';
    }
}
/** Column header: admin label → standard i18n label → EntraID label → key */
function getColumnHeader(key, listFieldLabels) {
    if (listFieldLabels[key])
        return listFieldLabels[key];
    var standardMap = {
        firstName: mystrings_1.strings.FieldFirstName,
        name: mystrings_1.strings.FieldName,
        email: mystrings_1.strings.FieldEmail,
        phone: mystrings_1.strings.FieldPhone,
        jobTitle: mystrings_1.strings.FieldJobTitle,
        department: mystrings_1.strings.FieldDepartment,
        officeLocation: mystrings_1.strings.FieldOfficeLocation,
        manager: mystrings_1.strings.FieldManager,
    };
    if (standardMap[key])
        return standardMap[key];
    if (!DirectoryConfig_1.STANDARD_FIELD_KEYS.has(key))
        return (0, DirectoryConfig_1.getEntraFieldLabel)(key);
    return key;
}
var CsvExport = function (_a) {
    var members = _a.members, listFieldOrder = _a.listFieldOrder, listFieldLabels = _a.listFieldLabels;
    var csvService = new CsvService_1.CsvService();
    var disabled = members.length === 0;
    var _b = React.useState(false), hovered = _b[0], setHovered = _b[1];
    var handleExport = function () {
        // Use exactly the configured list field order, skip non-exportable keys
        var keys = listFieldOrder.filter(function (k) { return !SKIP_KEYS.has(k); });
        var headers = keys.map(function (k) { return getColumnHeader(k, listFieldLabels); });
        var rows = members.map(function (m) { return keys.map(function (k) { return getMemberFieldValue(m, k); }); });
        var date = new Date().toISOString().split('T')[0];
        csvService.exportToCsv(headers, rows, "annuaire-sharepoint-".concat(date, ".csv"));
    };
    return (React.createElement("button", { onClick: handleExport, disabled: disabled, title: mystrings_1.strings.ExportCsv, "aria-label": mystrings_1.strings.ExportCsv, onMouseEnter: function () { return !disabled && setHovered(true); }, onMouseLeave: function () { return setHovered(false); }, style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 38,
            paddingLeft: 14,
            paddingRight: 14,
            borderRadius: 20,
            border: '1px solid #c7c9cc',
            backgroundColor: hovered ? '#f3f2f1' : '#ffffff',
            color: disabled ? '#605e5c' : '#605e5c',
            fontSize: 13,
            cursor: disabled ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            outline: 'none',
            transition: 'background-color 0.15s ease',
        } },
        React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true" },
            React.createElement("path", { d: "M8 12.5a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 1 0v9a.5.5 0 0 1-.5.5z" }),
            React.createElement("path", { d: "M4.646 9.146a.5.5 0 0 1 .708 0L8 11.793l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z" }),
            React.createElement("path", { d: "M2 14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1a.5.5 0 0 0-1 0v1H3v-1a.5.5 0 0 0-1 0v1z" })),
        mystrings_1.strings.ExportCsv));
};
exports.default = CsvExport;
//# sourceMappingURL=CsvExport.js.map