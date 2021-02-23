define(["require", "exports", "./deserializeObject"], function (require, exports, deserializeObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function deserializeArray(input, Class) {
        var array = [];
        _.each(input, (value) => {
            array.push(deserializeObject_1.default(value, Class));
        });
        return array;
    }
    exports.default = deserializeArray;
});
