"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamsDeepLink = void 0;
function getTeamsDeepLink(userPrincipalName) {
    return "https://teams.microsoft.com/l/chat/0/0?users=".concat(encodeURIComponent(userPrincipalName));
}
exports.getTeamsDeepLink = getTeamsDeepLink;
//# sourceMappingURL=teamsDeepLink.js.map