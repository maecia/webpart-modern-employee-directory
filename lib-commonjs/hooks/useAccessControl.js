"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccessControl = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var AccessControlService_1 = require("../services/AccessControlService");
function useAccessControl(context, groupId) {
    var _this = this;
    var _a = (0, react_1.useState)({
        hasAccess: true,
        userGroups: [],
        isLoading: true,
        error: null,
        retry: function () { }
    }), state = _a[0], setState = _a[1];
    var checkAccess = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var accessControlService, result_1, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    accessControlService = new AccessControlService_1.AccessControlService(context);
                    return [4 /*yield*/, accessControlService.checkAccess(groupId)];
                case 1:
                    result_1 = _a.sent();
                    setState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { hasAccess: result_1.hasAccess, userGroups: result_1.userGroups, isLoading: false, error: null })); });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    setState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { hasAccess: false, isLoading: false, error: 'Impossible de vérifier vos droits d\'accès.' })); });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [context, groupId]);
    (0, react_1.useEffect)(function () {
        checkAccess();
    }, [checkAccess]);
    var retry = (0, react_1.useCallback)(function () {
        setState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { isLoading: true, error: null })); });
        checkAccess();
    }, [checkAccess]);
    return tslib_1.__assign(tslib_1.__assign({}, state), { retry: retry });
}
exports.useAccessControl = useAccessControl;
//# sourceMappingURL=useAccessControl.js.map