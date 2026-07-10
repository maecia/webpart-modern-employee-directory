"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var Button_1 = require("@fluentui/react/lib/Button");
var mystrings_1 = require("../../loc/mystrings");
var ErrorState = function (_a) {
    var message = _a.message, onRetry = _a.onRetry;
    return (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error, isMultiline: false, actions: React.createElement(Button_1.DefaultButton, { onClick: onRetry }, mystrings_1.strings.Retry) }, message || mystrings_1.strings.ErrorLoading));
};
exports.default = ErrorState;
//# sourceMappingURL=ErrorState.js.map