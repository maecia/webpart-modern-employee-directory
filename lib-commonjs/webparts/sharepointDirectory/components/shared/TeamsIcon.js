"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var teamsLogoUrl = require('../../assets/teams-logo.png');
var TeamsIcon = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 20 : _b;
    return (React.createElement("img", { src: teamsLogoUrl, width: size, height: size, alt: "Microsoft Teams", style: { display: 'block', objectFit: 'contain' } }));
};
exports.default = TeamsIcon;
//# sourceMappingURL=TeamsIcon.js.map