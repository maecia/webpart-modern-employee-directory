"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphService = void 0;
var tslib_1 = require("tslib");
var graph_1 = require("@pnp/graph");
require("@pnp/graph/users");
require("@pnp/graph/photos");
var SELECT_FIELDS = [
    'id',
    'displayName',
    'givenName',
    'surname',
    'mail',
    'userPrincipalName',
    'jobTitle',
    'department',
    'officeLocation',
    'mobilePhone',
    'userType',
    'accountEnabled',
    'onPremisesExtensionAttributes',
];
var PAGE_SIZE = 100;
var DATE_FIELDS = new Set([
    'birthday',
    'employeeHireDate',
    'hireDate',
    'employeeLeaveDateTime',
    'createdDateTime',
    'lastPasswordChangeDateTime',
]);
function formatValue(key, v) {
    if (v === undefined || v === null)
        return '';
    if (Array.isArray(v))
        return v.filter(Boolean).join(', ');
    var s = String(v);
    if (DATE_FIELDS.has(key) && s) {
        var d = new Date(s);
        if (!isNaN(d.getTime()) && d.getFullYear() > 1900) {
            return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
        return '';
    }
    return s;
}
var GraphService = /** @class */ (function () {
    function GraphService(context) {
        this.photoUrls = [];
        this.graph = (0, graph_1.graphfi)().using((0, graph_1.SPFx)(context));
    }
    GraphService.prototype.getMembers = function (customFieldKeys) {
        var _a, e_1, _b, _c;
        var _d, _e;
        if (customFieldKeys === void 0) { customFieldKeys = []; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var allUsers, rawUsers, _f, _g, _h, page, e_1_1, customDataMap, detectedExtAttrs, _i, allUsers_1, user, i, v, members, _j, allUsers_2, user, cp;
            var _k;
            return tslib_1.__generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        allUsers = [];
                        rawUsers = (_k = this.graph.users)
                            .select.apply(_k, SELECT_FIELDS).expand('manager($select=id,displayName)')
                            .filter("accountEnabled eq true and userType eq 'Member'")
                            .top(PAGE_SIZE);
                        _l.label = 1;
                    case 1:
                        _l.trys.push([1, 6, 7, 12]);
                        _f = true, _g = tslib_1.__asyncValues(rawUsers);
                        _l.label = 2;
                    case 2: return [4 /*yield*/, _g.next()];
                    case 3:
                        if (!(_h = _l.sent(), _a = _h.done, !_a)) return [3 /*break*/, 5];
                        _c = _h.value;
                        _f = false;
                        page = _c;
                        allUsers.push.apply(allUsers, page);
                        _l.label = 4;
                    case 4:
                        _f = true;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _l.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _l.trys.push([7, , 10, 11]);
                        if (!(!_f && !_a && (_b = _g.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _b.call(_g)];
                    case 8:
                        _l.sent();
                        _l.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        customDataMap = {};
                        if (!(customFieldKeys.length > 0)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.fetchCustomProperties(allUsers, customFieldKeys)];
                    case 13:
                        customDataMap = _l.sent();
                        _l.label = 14;
                    case 14:
                        detectedExtAttrs = new Set();
                        for (_i = 0, allUsers_1 = allUsers; _i < allUsers_1.length; _i++) {
                            user = allUsers_1[_i];
                            if (user.onPremisesExtensionAttributes) {
                                for (i = 1; i <= 15; i++) {
                                    v = user.onPremisesExtensionAttributes["extensionAttribute".concat(i)];
                                    if (v !== null && v !== undefined && v !== '') {
                                        detectedExtAttrs.add("extensionAttribute".concat(i));
                                    }
                                }
                            }
                        }
                        members = [];
                        for (_j = 0, allUsers_2 = allUsers; _j < allUsers_2.length; _j++) {
                            user = allUsers_2[_j];
                            cp = customDataMap[user.id] || {};
                            members.push({
                                id: user.id || '',
                                displayName: user.displayName || '',
                                givenName: user.givenName || '',
                                surname: user.surname || '',
                                email: user.mail || user.userPrincipalName || '',
                                jobTitle: user.jobTitle || '',
                                department: user.department || '',
                                officeLocation: user.officeLocation || '',
                                mobilePhone: user.mobilePhone || '',
                                managerId: ((_d = user.manager) === null || _d === void 0 ? void 0 : _d.id) || undefined,
                                managerDisplayName: ((_e = user.manager) === null || _e === void 0 ? void 0 : _e.displayName) || undefined,
                                isVisible: true,
                                teamsId: user.userPrincipalName || undefined,
                                customProperties: cp,
                            });
                        }
                        return [2 /*return*/, { members: members, detectedExtensionAttrs: Array.from(detectedExtAttrs).sort() }];
                }
            });
        });
    };
    GraphService.prototype.fetchCustomProperties = function (users, customFieldKeys) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, selectFields, _i, customFieldKeys_1, key, CONCURRENCY, i, chunk, promises;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {};
                        selectFields = [];
                        for (_i = 0, customFieldKeys_1 = customFieldKeys; _i < customFieldKeys_1.length; _i++) {
                            key = customFieldKeys_1[_i];
                            if (key === 'division' || key === 'costCenter') {
                                if (!selectFields.includes('employeeOrgData'))
                                    selectFields.push('employeeOrgData');
                            }
                            else if (key.startsWith('extensionAttribute')) {
                                if (!selectFields.includes('onPremisesExtensionAttributes'))
                                    selectFields.push('onPremisesExtensionAttributes');
                            }
                            else {
                                if (!selectFields.includes(key))
                                    selectFields.push(key);
                            }
                        }
                        CONCURRENCY = 10;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < users.length)) return [3 /*break*/, 4];
                        chunk = users.slice(i, i + CONCURRENCY);
                        promises = chunk.map(function (user) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var detail, cp, _i, customFieldKeys_2, key, v, _a;
                            var _b;
                            var _c, _d, _e;
                            return tslib_1.__generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        if (!user.id)
                                            return [2 /*return*/];
                                        _f.label = 1;
                                    case 1:
                                        _f.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, (_b = this.graph.users.getById(user.id)).select.apply(_b, selectFields)()];
                                    case 2:
                                        detail = _f.sent();
                                        cp = {};
                                        for (_i = 0, customFieldKeys_2 = customFieldKeys; _i < customFieldKeys_2.length; _i++) {
                                            key = customFieldKeys_2[_i];
                                            v = void 0;
                                            if (key === 'division') {
                                                v = (_c = detail.employeeOrgData) === null || _c === void 0 ? void 0 : _c.division;
                                            }
                                            else if (key === 'costCenter') {
                                                v = (_d = detail.employeeOrgData) === null || _d === void 0 ? void 0 : _d.costCenter;
                                            }
                                            else if (key.startsWith('extensionAttribute')) {
                                                v = (_e = detail.onPremisesExtensionAttributes) === null || _e === void 0 ? void 0 : _e[key];
                                            }
                                            else {
                                                v = detail[key];
                                            }
                                            if (v !== undefined && v !== null) {
                                                cp[key] = formatValue(key, v);
                                            }
                                        }
                                        if (Object.keys(cp).length > 0) {
                                            result[user.id] = cp;
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        _a = _f.sent();
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i += CONCURRENCY;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    GraphService.prototype.getMemberPhoto = function (userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var blob, url, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.graph.users.getById(userId).photo.getBlob()];
                    case 1:
                        blob = _b.sent();
                        url = URL.createObjectURL(blob);
                        this.photoUrls.push(url);
                        return [2 /*return*/, url];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GraphService.prototype.dispose = function () {
        this.photoUrls.forEach(function (url) { return URL.revokeObjectURL(url); });
        this.photoUrls = [];
    };
    return GraphService;
}());
exports.GraphService = GraphService;
//# sourceMappingURL=GraphService.js.map