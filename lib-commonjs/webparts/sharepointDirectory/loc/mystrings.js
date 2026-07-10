"use strict";
// ─── Locale registry ──────────────────────────────────────────────────────────
//
// To add a new language (e.g. German):
//   1. Create src/webparts/sharepointDirectory/loc/de.ts  (copy en.ts, translate)
//   2. Add two lines below:
//        import de from './de'
//        locales.de = de
//
// That's it — no other file needs to change.
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLanguage = exports.strings = void 0;
var tslib_1 = require("tslib");
var fr_1 = tslib_1.__importDefault(require("./fr"));
var en_1 = tslib_1.__importDefault(require("./en"));
// Map ISO-639-1 language code → translation object.
// "en" is used as the fallback when a language is not registered.
var locales = {
    fr: fr_1.default,
    en: en_1.default,
};
var current = fr_1.default;
exports.strings = new Proxy({}, {
    get: function (_target, prop) {
        return current[prop];
    },
});
/** Call once at startup with the SharePoint currentCultureName (e.g. "fr-fr", "en-us"). */
function setLanguage(locale) {
    var _a;
    var lang = (locale || '').split('-')[0].toLowerCase();
    current = (_a = locales[lang]) !== null && _a !== void 0 ? _a : en_1.default;
}
exports.setLanguage = setLanguage;
//# sourceMappingURL=mystrings.js.map