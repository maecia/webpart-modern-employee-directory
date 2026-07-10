"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var Stack_1 = require("@fluentui/react/lib/Stack");
var Icon_1 = require("@fluentui/react/lib/Icon");
var mystrings_1 = require("../../loc/mystrings");
var AccessDenied = function () {
    return (React.createElement(Stack_1.Stack, { horizontalAlign: "center", verticalAlign: "center", tokens: { padding: 40 } },
        React.createElement(Icon_1.Icon, { iconName: "Lock", style: { fontSize: 48, color: '#605e5c', marginBottom: 12 } }),
        React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.warning, isMultiline: false }, mystrings_1.strings.AccessDeniedMessage)));
};
exports.default = AccessDenied;
//# sourceMappingURL=AccessDenied.js.map