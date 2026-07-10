"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var MessageBar_1 = require("@fluentui/react/lib/MessageBar");
var Button_1 = require("@fluentui/react/lib/Button");
var mystrings_1 = require("../../loc/mystrings");
var ErrorBoundary = /** @class */ (function (_super) {
    tslib_1.__extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.handleRetry = function () {
            _this.setState({ hasError: false });
        };
        _this.state = { hasError: false };
        return _this;
    }
    ErrorBoundary.prototype.componentDidCatch = function (_error, _errorInfo) {
        this.setState({ hasError: true });
    };
    ErrorBoundary.prototype.render = function () {
        if (this.state.hasError) {
            return (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error, isMultiline: false, actions: React.createElement(Button_1.DefaultButton, { onClick: this.handleRetry }, mystrings_1.strings.Retry) }, mystrings_1.strings.ErrorBoundaryMessage));
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(React.Component));
exports.default = ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map