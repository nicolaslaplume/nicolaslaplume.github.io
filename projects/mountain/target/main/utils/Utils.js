define(["require", "exports", "./deserializeObject", "./deserializeArray"], function (require, exports, deserializeObject_1, deserializeArray_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Utils = {
        deserializeObject: deserializeObject_1.default,
        deserializeArray: deserializeArray_1.default
    };
    exports.default = Utils;
});
