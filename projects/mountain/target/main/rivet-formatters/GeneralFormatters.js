define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function LoadGeneralFormatters() {
        rivets.formatters['debug'] = (v) => { debugger; return v; };
        rivets.formatters['not'] = val => !val;
        rivets.formatters['eq'] = (val1, val2) => val1 === val2;
        rivets.formatters['get'] = (model, prop) => model && model[prop];
        rivets.formatters['set'] = (model, prop, newValue) => {
            return () => {
                model[prop] = newValue;
            };
        };
        rivets.configure({
            handler: function (target, event, binding) {
                this.call(binding.view.models, target, event, binding.view.models);
            }
        });
    }
    exports.default = LoadGeneralFormatters;
});
