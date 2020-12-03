define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function deserializeObject(input, Class) {
        var o = new Class();
        o.deserialize(input);
        return o;
    }
    exports.default = deserializeObject;
});
