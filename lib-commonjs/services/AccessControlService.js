"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessControlService = void 0;
var tslib_1 = require("tslib");
var sp_1 = require("@pnp/sp");
require("@pnp/sp/webs");
require("@pnp/sp/site-groups/web");
require("@pnp/sp/site-users/web");
require("@pnp/sp/security/web");
var AccessControlService = /** @class */ (function () {
    function AccessControlService(context) {
        this.sp = (0, sp_1.spfi)().using((0, sp_1.SPFx)(context));
    }
    AccessControlService.prototype.checkAccess = function (groupId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var userGroups, hasAccess;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.currentUser.groups()];
                    case 1:
                        userGroups = _a.sent();
                        if (groupId === null || groupId === undefined) {
                            return [2 /*return*/, { hasAccess: true, userGroups: userGroups.map(function (g) { return g.Title; }) }];
                        }
                        hasAccess = userGroups.some(function (g) { return g.Id === groupId; });
                        return [2 /*return*/, { hasAccess: hasAccess, userGroups: userGroups.map(function (g) { return g.Title; }) }];
                }
            });
        });
    };
    return AccessControlService;
}());
exports.AccessControlService = AccessControlService;
//# sourceMappingURL=AccessControlService.js.map