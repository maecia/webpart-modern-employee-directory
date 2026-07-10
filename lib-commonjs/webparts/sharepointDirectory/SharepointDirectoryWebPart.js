"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ReactDom = tslib_1.__importStar(require("react-dom"));
var sp_core_library_1 = require("@microsoft/sp-core-library");
var Theme_1 = require("@fluentui/react/lib/Theme");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_property_pane_1 = require("@microsoft/sp-property-pane");
var Directory_1 = tslib_1.__importDefault(require("./components/Directory"));
var DirectoryConfig_1 = require("../../models/DirectoryConfig");
var useMembers_1 = require("../../hooks/useMembers");
var useDirectoryConfig_1 = require("../../hooks/useDirectoryConfig");
var mystrings_1 = require("./loc/mystrings");
var DnDFieldSelector_1 = tslib_1.__importDefault(require("./components/propertyPane/DnDFieldSelector"));
var ALL_FIELD_KEYS_SET = DirectoryConfig_1.STANDARD_FIELD_KEYS;
// Backward-compat references used only by migrateOldFieldOrder
var CARD_DEFAULTS = useDirectoryConfig_1.DEFAULT_CARD_ORDER;
var LIST_DEFAULTS = useDirectoryConfig_1.DEFAULT_LIST_ORDER;
var MODAL_DEFAULTS = useDirectoryConfig_1.DEFAULT_MODAL_ORDER;
var DirectoryContainer = function (_a) {
    var context = _a.context, config = _a.config, onDetectedExtAttrs = _a.onDetectedExtAttrs;
    var customFieldKeys = React.useMemo(function () {
        var all = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], config.cardFieldOrder, true), config.listFieldOrder, true), config.modalFieldOrder, true);
        var filtered = all.filter(function (k) { return !ALL_FIELD_KEYS_SET.has(k); });
        var seen = {};
        return filtered.filter(function (k) {
            if (seen[k])
                return false;
            seen[k] = true;
            return true;
        });
    }, [config.cardFieldOrder, config.listFieldOrder, config.modalFieldOrder]);
    var _b = (0, useMembers_1.useMembers)(context, customFieldKeys, onDetectedExtAttrs), members = _b.members, isLoading = _b.isLoading, error = _b.error, retry = _b.retry;
    return React.createElement(Directory_1.default, {
        config: config,
        members: members,
        isLoading: isLoading,
        error: error,
        onRetry: retry,
    });
};
var SharepointDirectoryWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(SharepointDirectoryWebPart, _super);
    function SharepointDirectoryWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._themePrimary = '#1B7A6E';
        _this._supportedLanguages = [];
        _this.detectedExtAttrs = [];
        return _this;
    }
    SharepointDirectoryWebPart.prototype.getSupportedLanguages = function () {
        var _a, _b;
        if (this._supportedLanguages.length > 0)
            return this._supportedLanguages;
        var ids = (_b = (_a = this.context.pageContext.legacyPageContext) === null || _a === void 0 ? void 0 : _a.web) === null || _b === void 0 ? void 0 : _b.supportedUILanguageIds;
        if (ids && ids.length > 0) {
            this._supportedLanguages = ids
                .map(function (id) { return SharepointDirectoryWebPart.LCID_TO_LANG[id]; })
                .filter(Boolean);
        }
        if (this._supportedLanguages.length === 0) {
            var lang = (this.context.pageContext.cultureInfo.currentCultureName || '').split('-')[0].toLowerCase();
            this._supportedLanguages = [lang || 'en'];
        }
        return this._supportedLanguages;
    };
    SharepointDirectoryWebPart.prototype.onInit = function () {
        (0, mystrings_1.setLanguage)(this.context.pageContext.cultureInfo.currentCultureName);
        if (!this.properties.activeViewTab)
            this.properties.activeViewTab = 'card';
        this.getSupportedLanguages();
        return _super.prototype.onInit.call(this);
    };
    SharepointDirectoryWebPart.prototype.render = function () {
        var _this = this;
        // Extract the Fluent UI theme primary — stored on the class so the
        // property pane (which lives in a separate iframe) can read it.
        var ThemeExtractor = function () {
            var theme = (0, Theme_1.useTheme)();
            React.useEffect(function () {
                var _a;
                var c = (_a = theme === null || theme === void 0 ? void 0 : theme.palette) === null || _a === void 0 ? void 0 : _a.themePrimary;
                if (c)
                    _this._themePrimary = c;
            });
            return null;
        };
        var rawConfig = {
            defaultView: this.properties.defaultView || 'card',
            sortOrder: (this.properties.sortOrder || 'lastNameAsc'),
            cardFieldOrder: this.getEffectiveFieldOrder('card'),
            listFieldOrder: this.getEffectiveFieldOrder('list'),
            modalFieldOrder: this.getEffectiveFieldOrder('modal'),
            listFieldLabels: this.getLocalizedLabels('list'),
            modalFieldLabels: this.getLocalizedLabels('modal'),
            filters: this.getFiltersFromProperties(),
        };
        var config = (0, useDirectoryConfig_1.useDirectoryConfig)(rawConfig);
        ReactDom.render(React.createElement(React.Fragment, null, React.createElement(ThemeExtractor), React.createElement(DirectoryContainer, {
            context: this.context,
            config: config,
            onDetectedExtAttrs: function (attrs) {
                if (JSON.stringify(_this.detectedExtAttrs) !== JSON.stringify(attrs)) {
                    _this.detectedExtAttrs = attrs;
                    _this.context.propertyPane.refresh();
                }
            },
        })), this.domElement);
    };
    SharepointDirectoryWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(SharepointDirectoryWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('2.0');
        },
        enumerable: false,
        configurable: true
    });
    SharepointDirectoryWebPart.prototype.getFiltersFromProperties = function () {
        var filters = [];
        var count = this.properties.filterCount || 0;
        var lang = (this.context.pageContext.cultureInfo.currentCultureName || '').split('-')[0].toLowerCase();
        for (var i = 1; i <= count; i++) {
            var fieldName = this.properties["filterField".concat(i)];
            if (!fieldName)
                continue;
            var props = this.properties;
            // Try new JSON format first, then fall back to old flat properties
            var json = props["filterLabels".concat(i, "Json")];
            var label = void 0;
            if (json) {
                try {
                    var labels = JSON.parse(json);
                    label = labels[lang] || '';
                }
                catch (_a) {
                    label = props["filterLabel_".concat(i, "_").concat(lang)] || '';
                }
            }
            else {
                label = props["filterLabel_".concat(i, "_").concat(lang)] || props["filterLabelFr".concat(i)] || '';
            }
            filters.push({ fieldName: fieldName, label: label });
        }
        return filters;
    };
    // ─── New helper methods ──────────────────────────────────────────────────
    /** Parse the JSON stored in *FieldsJson — migrate from old flat props if absent */
    SharepointDirectoryWebPart.prototype.getEffectiveFieldOrder = function (view) {
        var prop = view === 'card'
            ? 'cardFieldsJson'
            : view === 'list'
                ? 'listFieldsJson'
                : 'modalFieldsJson';
        var json = this.properties[prop];
        if (json) {
            try {
                return JSON.parse(json);
            }
            catch (_a) {
                /* fall through */
            }
        }
        return this.migrateOldFieldOrder(view);
    };
    /** Build initial order from the old flat customCardField1-5 properties */
    SharepointDirectoryWebPart.prototype.migrateOldFieldOrder = function (view) {
        var defaults = view === 'card'
            ? CARD_DEFAULTS
            : view === 'list'
                ? LIST_DEFAULTS
                : MODAL_DEFAULTS;
        var fieldsProp = view === 'card'
            ? 'cardFields'
            : view === 'list'
                ? 'listFields'
                : 'modalFields';
        var saved = this.properties[fieldsProp];
        var standard = saved && saved.length > 0 ? saved : defaults;
        var prefix = view === 'card'
            ? 'customCardField'
            : view === 'list'
                ? 'customListField'
                : 'customModalField';
        var count = this.properties["".concat(prefix, "Count")] || 0;
        var custom = [];
        for (var i = 1; i <= count; i++) {
            var v = this.properties["".concat(prefix).concat(i)];
            if (v)
                custom.push(v);
        }
        return tslib_1.__spreadArray(tslib_1.__spreadArray([], standard, true), custom, true);
    };
    /** Parse labels JSON — migrate from old LabelFr/LabelEn flat props if absent */
    SharepointDirectoryWebPart.prototype.parseFieldLabelsRecord = function (view) {
        var prop = view === 'list' ? 'listFieldLabelsJson' : 'modalFieldLabelsJson';
        var json = this.properties[prop];
        if (json) {
            try {
                return JSON.parse(json);
            }
            catch (_a) {
                /* fall through */
            }
        }
        // Migrate from old flat properties
        var prefix = view === 'list' ? 'customListField' : 'customModalField';
        var count = this.properties["".concat(prefix, "Count")] || 0;
        var result = {};
        for (var i = 1; i <= count; i++) {
            var key = this.properties["".concat(prefix).concat(i)];
            if (key) {
                var fr = this.properties["".concat(prefix, "LabelFr").concat(i)] || '';
                var en = this.properties["".concat(prefix, "LabelEn").concat(i)] || '';
                var entry = {};
                if (fr)
                    entry['fr'] = fr;
                if (en)
                    entry['en'] = en;
                if (Object.keys(entry).length > 0)
                    result[key] = entry;
            }
        }
        return result;
    };
    /** Return localized (single string) labels per field key for the given view */
    SharepointDirectoryWebPart.prototype.getLocalizedLabels = function (view) {
        var record = this.parseFieldLabelsRecord(view);
        var lang = (this.context.pageContext.cultureInfo.currentCultureName || '').split('-')[0].toLowerCase();
        var result = {};
        for (var _i = 0, _a = Object.entries(record); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], labels = _b[1];
            var labelMap = labels;
            result[key] = labelMap[lang] || '';
        }
        return result;
    };
    SharepointDirectoryWebPart.prototype.onPropertyPaneFieldChanged = function (propertyPath, oldValue, newValue) {
        _super.prototype.onPropertyPaneFieldChanged.call(this, propertyPath, oldValue, newValue);
        this.context.propertyPane.refresh();
    };
    SharepointDirectoryWebPart.prototype.getPropertyPaneConfiguration = function () {
        var _this = this;
        var filterCount = this.properties.filterCount || 0;
        var activeTab = (this.properties.activeViewTab || 'card');
        // ── Filter field options (base + EntraID + detected ext attrs) ──────────
        var buildFilterOptions = function () {
            var options = [
                { key: '', text: mystrings_1.strings.None },
                { key: 'givenName', text: mystrings_1.strings.FieldFirstName },
                { key: 'surname', text: mystrings_1.strings.FieldName },
                { key: 'mail', text: mystrings_1.strings.FieldEmail },
                { key: 'mobilePhone', text: mystrings_1.strings.FieldPhone },
                { key: 'jobTitle', text: mystrings_1.strings.FieldJobTitle },
                { key: 'department', text: mystrings_1.strings.FieldDepartment },
                { key: 'officeLocation', text: mystrings_1.strings.FieldOfficeLocation },
                { key: 'managerDisplayName', text: mystrings_1.strings.FieldManager },
            ];
            for (var _i = 0, _a = (0, DirectoryConfig_1.getAvailableEntraIdFieldGroups)(); _i < _a.length; _i++) {
                var group = _a[_i];
                for (var _b = 0, _c = group.fields; _b < _c.length; _b++) {
                    var f = _c[_b];
                    options.push({ key: f.key, text: f.label });
                }
            }
            for (var _d = 0, _e = _this.detectedExtAttrs; _d < _e.length; _d++) {
                var k = _e[_d];
                options.push({ key: k, text: mystrings_1.strings["EntraField_".concat(k)] || k });
            }
            return options;
        };
        var FILTER_OPTIONS = buildFilterOptions();
        var filterGroupFields = [];
        for (var i = 1; i <= filterCount; i++) {
            filterGroupFields.push((0, sp_webpart_base_1.PropertyPaneDropdown)("filterField".concat(i), {
                label: "".concat(mystrings_1.strings.FilterLabel, " ").concat(i, " \u2014 ").concat(mystrings_1.strings.FilterFieldLabel),
                options: FILTER_OPTIONS,
                selectedKey: this.properties["filterField".concat(i)] || '',
            }));
            // Dynamic label fields — one per supported language
            for (var _i = 0, _a = this._supportedLanguages; _i < _a.length; _i++) {
                var lang = _a[_i];
                var propName = "filterLabel_".concat(i, "_").concat(lang);
                var langLabel = mystrings_1.strings["Lang_".concat(lang)] || lang;
                filterGroupFields.push((0, sp_webpart_base_1.PropertyPaneTextField)(propName, {
                    label: langLabel,
                    value: this.properties[propName] || '',
                }));
            }
            filterGroupFields.push((0, sp_webpart_base_1.PropertyPaneButton)("removeFilter".concat(i), {
                text: mystrings_1.strings.RemoveFilterLabel,
                buttonType: sp_webpart_base_1.PropertyPaneButtonType.Command,
                icon: 'Delete',
                onClick: function () {
                    _this.properties.filterCount = Math.max(0, filterCount - 1);
                    _this.context.propertyPane.refresh();
                },
            }));
        }
        if (filterCount < 3) {
            filterGroupFields.push((0, sp_webpart_base_1.PropertyPaneButton)('addFilter', {
                text: mystrings_1.strings.AddFilter,
                buttonType: sp_webpart_base_1.PropertyPaneButtonType.Command,
                icon: 'Add',
                onClick: function () {
                    _this.properties.filterCount = filterCount + 1;
                    _this.context.propertyPane.refresh();
                },
            }));
        }
        // ── DnD custom field — remounts when activeTab changes (via key prop) ─────
        var dndCustomField = {
            type: sp_property_pane_1.PropertyPaneFieldType.Custom,
            targetProperty: 'dnd_selector',
            shouldFocus: false,
            properties: {
                key: 'dnd_selector',
                onRender: function (elem) {
                    var primaryColor = _this._themePrimary;
                    // Inject CSS override — primary color for choice group, label font size
                    var doc = elem.ownerDocument;
                    if (!doc.getElementById('spdir-chocegroup-override')) {
                        var style = doc.createElement('style');
                        style.id = 'spdir-chocegroup-override';
                        style.textContent = "\n            .ms-ChoiceField--image.is-checked::before { border-color: ".concat(primaryColor, " !important; }\n            .ms-ChoiceField--image.is-checked .ms-ChoiceField-icon { color: ").concat(primaryColor, " !important; }\n            .ms-ChoiceField--image:hover::before { border-color: ").concat(primaryColor, " !important; }\n            .ms-ChoiceField-field.is-checked::before { border-color: ").concat(primaryColor, " !important; }\n            .ms-ChoiceField-field.is-checked .ms-ChoiceField-icon { color: ").concat(primaryColor, " !important; }\n            [class*=\"PropertyPane\"] label { color: #323130 !important; }\n          ");
                        doc.head.appendChild(style);
                    }
                    // Reduce ChoiceGroup tab label font size from 14px to 12px
                    if (!doc.getElementById('spdir-chocegroup-font')) {
                        var fontStyle = doc.createElement('style');
                        fontStyle.id = 'spdir-chocegroup-font';
                        fontStyle.textContent = "[class*=\"ChoiceGroup\"] label, [role=\"radiogroup\"] label { font-size: 12px !important; }";
                        doc.head.appendChild(fontStyle);
                    }
                    var tab = (_this.properties.activeViewTab || 'card');
                    var selectedKeys = _this.getEffectiveFieldOrder(tab);
                    var labelsJson = tab === 'list'
                        ? _this.properties.listFieldLabelsJson || '{}'
                        : tab === 'modal'
                            ? _this.properties.modalFieldLabelsJson || '{}'
                            : '{}';
                    var onUpdateKeys = function (newKeys) {
                        var prop = tab === 'card'
                            ? 'cardFieldsJson'
                            : tab === 'list'
                                ? 'listFieldsJson'
                                : 'modalFieldsJson';
                        _this.properties[prop] = JSON.stringify(newKeys);
                        _this.render();
                    };
                    var onUpdateLabels = function (newLabelsJson) {
                        var prop = tab === 'list' ? 'listFieldLabelsJson' : 'modalFieldLabelsJson';
                        _this.properties[prop] = newLabelsJson;
                        _this.render();
                    };
                    ReactDom.render(React.createElement(DnDFieldSelector_1.default, {
                        key: tab, // force remount when tab changes
                        view: tab,
                        selectedKeys: selectedKeys,
                        labelsJson: labelsJson,
                        detectedExtAttrs: _this.detectedExtAttrs,
                        primaryColor: primaryColor,
                        supportedLanguages: _this._supportedLanguages,
                        onUpdateKeys: onUpdateKeys,
                        onUpdateLabels: onUpdateLabels,
                    }), elem);
                },
                onDispose: function (elem) {
                    ReactDom.unmountComponentAtNode(elem);
                },
            },
        };
        return {
            pages: [
                {
                    header: { description: mystrings_1.strings.PropertyPaneHeader },
                    groups: [
                        {
                            groupName: mystrings_1.strings.ViewGroupName,
                            groupFields: [
                                (0, sp_webpart_base_1.PropertyPaneDropdown)('defaultView', {
                                    label: mystrings_1.strings.DefaultViewLabel,
                                    options: [
                                        { key: 'card', text: mystrings_1.strings.ViewTrombinoscope },
                                        { key: 'list', text: mystrings_1.strings.ViewList },
                                    ],
                                    selectedKey: this.properties.defaultView || 'card',
                                }),
                                (0, sp_webpart_base_1.PropertyPaneDropdown)('sortOrder', {
                                    label: mystrings_1.strings.SortOrderLabel,
                                    options: [
                                        { key: 'lastNameAsc', text: mystrings_1.strings.SortLastNameAsc },
                                        { key: 'lastNameDesc', text: mystrings_1.strings.SortLastNameDesc },
                                        { key: 'firstNameAsc', text: mystrings_1.strings.SortFirstNameAsc },
                                        { key: 'firstNameDesc', text: mystrings_1.strings.SortFirstNameDesc },
                                        { key: 'random', text: mystrings_1.strings.SortRandom },
                                    ],
                                    selectedKey: this.properties.sortOrder || 'lastNameAsc',
                                }),
                            ],
                        },
                        {
                            groupName: mystrings_1.strings.FilterGroupName,
                            groupFields: filterGroupFields.length > 0
                                ? filterGroupFields
                                : [(0, sp_webpart_base_1.PropertyPaneLabel)('noFilter', { text: mystrings_1.strings.NoFilter })],
                        },
                        {
                            // Tab selector — 3 icon buttons Card / List / Modal
                            groupName: mystrings_1.strings.ViewTabLabel,
                            groupFields: [
                                (0, sp_webpart_base_1.PropertyPaneChoiceGroup)('activeViewTab', {
                                    label: '',
                                    options: [
                                        {
                                            key: 'card',
                                            text: mystrings_1.strings.TabCard,
                                            iconProps: { officeFabricIconFontName: 'GridViewMedium' },
                                        },
                                        {
                                            key: 'list',
                                            text: mystrings_1.strings.TabList,
                                            iconProps: { officeFabricIconFontName: 'BulletedList2' },
                                        },
                                        {
                                            key: 'modal',
                                            text: mystrings_1.strings.TabModal,
                                            iconProps: { officeFabricIconFontName: 'ContactInfo' },
                                        },
                                    ],
                                }),
                                dndCustomField,
                            ],
                        },
                    ],
                },
            ],
        };
    };
    // ── LCID → language code mapping ──────────────────────────────────────────
    SharepointDirectoryWebPart.LCID_TO_LANG = {
        1033: 'en', 1036: 'fr', 1031: 'de', 3082: 'es',
        1040: 'it', 1043: 'nl', 1046: 'pt', 1049: 'ru',
        1055: 'tr', 1025: 'ar', 1028: 'zh', 1041: 'ja',
        1042: 'ko', 1053: 'sv', 1044: 'nb', 1030: 'da',
        1035: 'fi', 1029: 'cs', 1038: 'hu', 1045: 'pl',
        2070: 'pt', 1069: 'eu', 1081: 'hi', 1110: 'gl',
    };
    return SharepointDirectoryWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = SharepointDirectoryWebPart;
//# sourceMappingURL=SharepointDirectoryWebPart.js.map