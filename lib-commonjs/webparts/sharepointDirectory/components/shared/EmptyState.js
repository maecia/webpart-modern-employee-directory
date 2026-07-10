"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Stack_1 = require("@fluentui/react/lib/Stack");
var Icon_1 = require("@fluentui/react/lib/Icon");
var Text_1 = require("@fluentui/react/lib/Text");
var mystrings_1 = require("../../loc/mystrings");
var EmptyState = function () {
    return (React.createElement(Stack_1.Stack, { horizontalAlign: "center", verticalAlign: "center", tokens: { padding: 40, childrenGap: 12 } },
        React.createElement(Icon_1.Icon, { iconName: "SearchIssue", style: { fontSize: 48, color: '#605e5c' }, "aria-hidden": "true" }),
        React.createElement(Text_1.Text, { variant: "large", role: "status" }, mystrings_1.strings.NoResults),
        React.createElement(Text_1.Text, { variant: "medium", style: { color: '#605e5c' } }, mystrings_1.strings.EmptyStateHint)));
};
exports.default = EmptyState;
//# sourceMappingURL=EmptyState.js.map