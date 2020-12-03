define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function defaultLerp(a, b, x) {
        return (b - a) * x + a;
    }
    class default_1 {
        constructor(parameters) {
            this.currentTime = 0;
            this.startValue = 0;
            this.endValue = 0;
            this.totalTime = 0;
            _.defaults(parameters, {
                startValue: 0,
                endValue: 0,
                totalTime: 0,
                lerpFX: defaultLerp,
                update: (value) => { },
                completed: () => { }
            });
            this.startValue = parameters.startValue;
            this.endValue = parameters.endValue;
            this.totalTime = parameters.totalTime;
            this.update = parameters.update;
            this.lerpFX = parameters.lerpFX;
            this.completed = parameters.completed;
        }
        Update() {
            this.currentTime += 1000 / 60;
            var value = this.lerpFX(this.startValue, this.endValue, Math.min(1, this.currentTime / this.totalTime));
            this.update(value);
            if (this.currentTime >= this.totalTime) {
                this.completed();
                return true;
            }
            return false;
        }
    }
    exports.default = default_1;
});
