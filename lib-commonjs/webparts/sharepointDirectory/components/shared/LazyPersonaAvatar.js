"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var PhotoContext_1 = require("../PhotoContext");
var PersonaAvatar_1 = tslib_1.__importDefault(require("./PersonaAvatar"));
var LazyPersonaAvatar = function (_a) {
    var userId = _a.userId, displayName = _a.displayName, givenName = _a.givenName, size = _a.size, coinSize = _a.coinSize, imageShouldFadeIn = _a.imageShouldFadeIn;
    var _b = React.useState(undefined), photoUrl = _b[0], setPhotoUrl = _b[1];
    var ref = React.useRef(null);
    var getPhoto = React.useContext(PhotoContext_1.PhotoContext);
    var loadedRef = React.useRef(false);
    React.useEffect(function () {
        if (!userId || !getPhoto || loadedRef.current)
            return;
        var el = ref.current;
        if (!el)
            return;
        var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                loadedRef.current = true;
                getPhoto(userId).then(function (url) {
                    if (url)
                        setPhotoUrl(url);
                });
            }
        }, { rootMargin: '200px' });
        observer.observe(el);
        return function () { return observer.disconnect(); };
    }, [userId, getPhoto]);
    return (React.createElement("div", { ref: ref },
        React.createElement(PersonaAvatar_1.default, { photoUrl: photoUrl, displayName: displayName, givenName: givenName, size: size, coinSize: coinSize, imageShouldFadeIn: imageShouldFadeIn })));
};
exports.default = LazyPersonaAvatar;
//# sourceMappingURL=LazyPersonaAvatar.js.map