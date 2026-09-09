"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePhotoCache = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var GraphService_1 = require("../services/GraphService");
function usePhotoCache(context) {
    var _this = this;
    var serviceRef = (0, react_1.useRef)(null);
    var cacheRef = (0, react_1.useRef)(new Map());
    var pendingRef = (0, react_1.useRef)(new Map());
    if (!serviceRef.current) {
        serviceRef.current = new GraphService_1.GraphService(context);
    }
    (0, react_1.useEffect)(function () {
        return function () {
            var _a;
            (_a = serviceRef.current) === null || _a === void 0 ? void 0 : _a.dispose();
            serviceRef.current = null;
        };
    }, []);
    var getPhoto = (0, react_1.useCallback)(function (userId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var promise;
        return tslib_1.__generator(this, function (_a) {
            if (cacheRef.current.has(userId)) {
                return [2 /*return*/, cacheRef.current.get(userId)];
            }
            if (pendingRef.current.has(userId)) {
                return [2 /*return*/, pendingRef.current.get(userId)];
            }
            promise = serviceRef.current.getMemberPhoto(userId).then(function (url) {
                cacheRef.current.set(userId, url);
                pendingRef.current.delete(userId);
                return url;
            });
            pendingRef.current.set(userId, promise);
            return [2 /*return*/, promise];
        });
    }); }, []);
    return getPhoto;
}
exports.usePhotoCache = usePhotoCache;
//# sourceMappingURL=usePhotoCache.js.map