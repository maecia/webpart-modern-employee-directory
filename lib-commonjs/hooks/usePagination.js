"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePagination = void 0;
var react_1 = require("react");
var PAGE_SIZES = {
    card: 24,
    list: 15
};
function usePagination(items, view) {
    var _a = (0, react_1.useState)(1), page = _a[0], setPage = _a[1];
    var pageSize = PAGE_SIZES[view];
    var visibleItems = (0, react_1.useMemo)(function () {
        return items.slice(0, page * pageSize);
    }, [items, page, pageSize]);
    var hasMore = visibleItems.length < items.length;
    var loadMore = (0, react_1.useCallback)(function () {
        setPage(function (p) { return p + 1; });
    }, []);
    var reset = (0, react_1.useCallback)(function () {
        setPage(1);
    }, []);
    return { visibleItems: visibleItems, hasMore: hasMore, loadMore: loadMore, reset: reset };
}
exports.usePagination = usePagination;
//# sourceMappingURL=usePagination.js.map