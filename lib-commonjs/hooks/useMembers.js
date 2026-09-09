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
        var service, _a, data, detectedExtensionAttrs, err_1;
        var _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setIsLoading(true);
                    setError(null);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    (_b = serviceRef.current) === null || _b === void 0 ? void 0 : _b.dispose();
                    service = new GraphService_1.GraphService(context);
                    serviceRef.current = service;
                    return [4 /*yield*/, service.getMembers(customFieldKeys)];
                case 2:
                    _a = _c.sent(), data = _a.members, detectedExtensionAttrs = _a.detectedExtensionAttrs;
                    if (detectedExtensionAttrs.length > 0 && onDetectedExtensionAttrs) {
                        onDetectedExtensionAttrs(detectedExtensionAttrs);
                    }
                    setMembers(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _c.sent();
                    setError(mystrings_1.strings.ErrorLoading);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
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