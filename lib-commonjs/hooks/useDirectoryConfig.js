"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDirectoryConfig = exports.DEFAULT_MODAL_ORDER = exports.DEFAULT_LIST_ORDER = exports.DEFAULT_CARD_ORDER = void 0;
var DEFAULT_CARD_ORDER = [
    'photo',
    'firstName',
    'name',
    'outlook',
    'teams',
];
exports.DEFAULT_CARD_ORDER = DEFAULT_CARD_ORDER;
var DEFAULT_LIST_ORDER = [
    'photo',
    'firstName',
    'name',
    'email',
    'phone',
    'jobTitle',
    'department',
    'manager',
];
exports.DEFAULT_LIST_ORDER = DEFAULT_LIST_ORDER;
var DEFAULT_MODAL_ORDER = [
    'photo',
    'firstName',
    'name',
    'email',
    'phone',
    'jobTitle',
    'department',
    'officeLocation',
    'outlook',
    'teams',
];
exports.DEFAULT_MODAL_ORDER = DEFAULT_MODAL_ORDER;
function useDirectoryConfig(rawConfig) {
    return {
        defaultView: rawConfig.defaultView || 'card',
        sortOrder: rawConfig.sortOrder || 'lastNameAsc',
        filters: rawConfig.filters || [],
        cardFieldOrder: rawConfig.cardFieldOrder || DEFAULT_CARD_ORDER,
        listFieldOrder: rawConfig.listFieldOrder || DEFAULT_LIST_ORDER,
        modalFieldOrder: rawConfig.modalFieldOrder || DEFAULT_MODAL_ORDER,
        listFieldLabels: rawConfig.listFieldLabels || {},
        modalFieldLabels: rawConfig.modalFieldLabels || {},
    };
}
exports.useDirectoryConfig = useDirectoryConfig;
//# sourceMappingURL=useDirectoryConfig.js.map