"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Spinner_1 = require("@fluentui/react/lib/Spinner");
var Stack_1 = require("@fluentui/react/lib/Stack");
var mystrings_1 = require("../../loc/mystrings");
var LoadingState = function () {
    return (React.createElement(Stack_1.Stack, { horizontalAlign: "center", verticalAlign: "center", tokens: { padding: 40 } },
        React.createElement(Spinner_1.Spinner, { size: Spinner_1.SpinnerSize.large, label: mystrings_1.strings.LoadingText })));
};
exports.default = LoadingState;
//# sourceMappingURL=LoadingState.js.map