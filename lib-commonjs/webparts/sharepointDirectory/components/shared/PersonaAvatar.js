"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Persona_1 = require("@fluentui/react/lib/Persona");
var defaultAvatarUrl = require('../../assets/default-avatar.png');
var PersonaAvatar = function (_a) {
    var photoUrl = _a.photoUrl, displayName = _a.displayName, givenName = _a.givenName, _b = _a.size, size = _b === void 0 ? Persona_1.PersonaSize.size48 : _b, coinSize = _a.coinSize, _c = _a.imageShouldFadeIn, imageShouldFadeIn = _c === void 0 ? true : _c;
    return (React.createElement(Persona_1.Persona, { imageUrl: photoUrl || defaultAvatarUrl, text: displayName, secondaryText: givenName, size: size, coinSize: coinSize, hidePersonaDetails: true, imageShouldFadeIn: imageShouldFadeIn, styles: {
            root: {
                justifyContent: 'center',
            },
        } }));
};
exports.default = PersonaAvatar;
//# sourceMappingURL=PersonaAvatar.js.map