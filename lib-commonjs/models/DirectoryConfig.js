"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVAILABLE_ENTRAID_FIELDS = exports.getEntraFieldLabel = exports.getAvailableEntraIdFields = exports.getAvailableEntraIdFieldGroups = exports.STANDARD_FIELD_KEYS = void 0;
var mystrings_1 = require("../webparts/sharepointDirectory/loc/mystrings");
/** All standard CardFieldName keys — not fetched via Graph custom properties */
exports.STANDARD_FIELD_KEYS = new Set([
    'photo',
    'name',
    'firstName',
    'email',
    'phone',
    'jobTitle',
    'department',
    'officeLocation',
    'manager',
    'outlook',
    'teams',
]);
function getAvailableEntraIdFieldGroups() {
    return [
        {
            groupKey: 'profile',
            label: mystrings_1.strings.DnD_Group_Profile,
            fields: [
                { key: 'aboutMe', label: mystrings_1.strings.EntraField_aboutMe },
                { key: 'birthday', label: mystrings_1.strings.EntraField_birthday },
                { key: 'interests', label: mystrings_1.strings.EntraField_interests },
                { key: 'pastProjects', label: mystrings_1.strings.EntraField_pastProjects },
                { key: 'responsibilities', label: mystrings_1.strings.EntraField_responsibilities },
                { key: 'schools', label: mystrings_1.strings.EntraField_schools },
                { key: 'skills', label: mystrings_1.strings.EntraField_skills },
            ],
        },
        {
            groupKey: 'contact',
            label: mystrings_1.strings.DnD_Group_Contact,
            fields: [
                { key: 'streetAddress', label: mystrings_1.strings.EntraField_streetAddress },
                { key: 'city', label: mystrings_1.strings.EntraField_city },
                { key: 'state', label: mystrings_1.strings.EntraField_state },
                { key: 'postalCode', label: mystrings_1.strings.EntraField_postalCode },
                { key: 'country', label: mystrings_1.strings.EntraField_country },
                { key: 'businessPhones', label: mystrings_1.strings.EntraField_businessPhones },
                { key: 'faxNumber', label: mystrings_1.strings.EntraField_faxNumber },
                { key: 'otherMails', label: mystrings_1.strings.EntraField_otherMails },
                { key: 'imAddresses', label: mystrings_1.strings.EntraField_imAddresses },
                { key: 'mySite', label: mystrings_1.strings.EntraField_mySite },
            ],
        },
        {
            groupKey: 'company',
            label: mystrings_1.strings.DnD_Group_Company,
            fields: [
                { key: 'companyName', label: mystrings_1.strings.EntraField_companyName },
                { key: 'employeeId', label: mystrings_1.strings.EntraField_employeeId },
                { key: 'employeeType', label: mystrings_1.strings.EntraField_employeeType },
                { key: 'employeeHireDate', label: mystrings_1.strings.EntraField_employeeHireDate },
                { key: 'hireDate', label: mystrings_1.strings.EntraField_hireDate },
                {
                    key: 'employeeLeaveDateTime',
                    label: mystrings_1.strings.EntraField_employeeLeaveDateTime,
                },
                { key: 'division', label: mystrings_1.strings.EntraField_division },
                { key: 'costCenter', label: mystrings_1.strings.EntraField_costCenter },
            ],
        },
        {
            groupKey: 'region',
            label: mystrings_1.strings.DnD_Group_Region,
            fields: [
                {
                    key: 'preferredLanguage',
                    label: mystrings_1.strings.EntraField_preferredLanguage,
                },
                { key: 'usageLocation', label: mystrings_1.strings.EntraField_usageLocation },
            ],
        },
        {
            groupKey: 'other',
            label: mystrings_1.strings.DnD_Group_Other,
            fields: [
                { key: 'createdDateTime', label: mystrings_1.strings.EntraField_createdDateTime },
                { key: 'ageGroup', label: mystrings_1.strings.EntraField_ageGroup },
                {
                    key: 'consentProvidedForMinor',
                    label: mystrings_1.strings.EntraField_consentProvidedForMinor,
                },
                {
                    key: 'legalAgeGroupClassification',
                    label: mystrings_1.strings.EntraField_legalAgeGroupClassification,
                },
                {
                    key: 'externalUserState',
                    label: mystrings_1.strings.EntraField_externalUserState,
                },
                { key: 'mailNickname', label: mystrings_1.strings.EntraField_mailNickname },
                {
                    key: 'lastPasswordChangeDateTime',
                    label: mystrings_1.strings.EntraField_lastPasswordChangeDateTime,
                },
            ],
        },
        {
            groupKey: 'onprem',
            label: mystrings_1.strings.DnD_Group_OnPrem,
            fields: [
                {
                    key: 'onPremisesDistinguishedName',
                    label: mystrings_1.strings.EntraField_onPremisesDistinguishedName,
                },
                {
                    key: 'onPremisesDomainName',
                    label: mystrings_1.strings.EntraField_onPremisesDomainName,
                },
                {
                    key: 'onPremisesSamAccountName',
                    label: mystrings_1.strings.EntraField_onPremisesSamAccountName,
                },
                {
                    key: 'onPremisesUserPrincipalName',
                    label: mystrings_1.strings.EntraField_onPremisesUserPrincipalName,
                },
            ],
        },
    ];
}
exports.getAvailableEntraIdFieldGroups = getAvailableEntraIdFieldGroups;
function getAvailableEntraIdFields() {
    return getAvailableEntraIdFieldGroups().reduce(function (acc, g) { return acc.concat(g.fields); }, []);
}
exports.getAvailableEntraIdFields = getAvailableEntraIdFields;
/** Return the localized display label for any EntraID or extensionAttribute field key */
function getEntraFieldLabel(key) {
    for (var _i = 0, _a = getAvailableEntraIdFieldGroups(); _i < _a.length; _i++) {
        var group = _a[_i];
        var found = group.fields.find(function (f) { return f.key === key; });
        if (found)
            return found.label;
    }
    var strKey = "EntraField_".concat(key);
    return mystrings_1.strings[strKey] || key;
}
exports.getEntraFieldLabel = getEntraFieldLabel;
/** @deprecated Use getEntraFieldLabel() instead */
exports.AVAILABLE_ENTRAID_FIELDS = new Proxy([], {
    get: function (_target, prop) {
        var live = getAvailableEntraIdFields();
        if (prop === 'find')
            return live.find.bind(live);
        if (prop === 'filter')
            return live.filter.bind(live);
        if (prop === 'map')
            return live.map.bind(live);
        if (prop === 'length')
            return live.length;
        if (typeof prop === 'string' && !isNaN(Number(prop)))
            return live[Number(prop)];
        return live[prop];
    },
});
//# sourceMappingURL=DirectoryConfig.js.map