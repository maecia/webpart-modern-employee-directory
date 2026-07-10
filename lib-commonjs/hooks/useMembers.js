"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMembers = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var GraphService_1 = require("../services/GraphService");
var mystrings_1 = require("../webparts/sharepointDirectory/loc/mystrings");
function useMembers(context, customFieldKeys, onDetectedExtensionAttrs) {
    var _this = this;
    if (customFieldKeys === void 0) { customFieldKeys = []; }
    var _a = (0, react_1.useState)([]), members = _a[0], setMembers = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(0), retryCount = _d[0], setRetryCount = _d[1];
    var serviceRef = (0, react_1.useRef)(null);
    var loadMembers = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var service_1, _a, data, detectedExtensionAttrs, membersWithPhotos, err_1;
        var _this = this;
        var _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setIsLoading(true);
                    setError(null);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, 5, 6]);
                    (_b = serviceRef.current) === null || _b === void 0 ? void 0 : _b.dispose();
                    service_1 = new GraphService_1.GraphService(context);
                    serviceRef.current = service_1;
                    return [4 /*yield*/, service_1.getMembers(customFieldKeys)];
                case 2:
                    _a = _c.sent(), data = _a.members, detectedExtensionAttrs = _a.detectedExtensionAttrs;
                    if (detectedExtensionAttrs.length > 0 && onDetectedExtensionAttrs) {
                        onDetectedExtensionAttrs(detectedExtensionAttrs);
                    }
                    return [4 /*yield*/, Promise.all(data.map(function (member) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var photoUrl;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!member.id) return [3 /*break*/, 2];
                                        return [4 /*yield*/, service_1.getMemberPhoto(member.id)];
                                    case 1:
                                        photoUrl = _a.sent();
                                        return [2 /*return*/, tslib_1.__assign(tslib_1.__assign({}, member), { photoUrl: photoUrl || undefined })];
                                    case 2: return [2 /*return*/, member];
                                }
                            });
                        }); }))];
                case 3:
                    membersWithPhotos = _c.sent();
                    setMembers(membersWithPhotos);
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _c.sent();
                    setError(mystrings_1.strings.ErrorLoading);
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [context, retryCount, customFieldKeys.join(',')]);
    (0, react_1.useEffect)(function () {
        loadMembers();
        return function () {
            var _a;
            (_a = serviceRef.current) === null || _a === void 0 ? void 0 : _a.dispose();
        };
    }, [loadMembers]);
    var retry = (0, react_1.useCallback)(function () {
        setRetryCount(function (c) { return c + 1; });
    }, []);
    return { members: members, isLoading: isLoading, error: error, retry: retry };
}
exports.useMembers = useMembers;
//# sourceMappingURL=useMembers.js.map