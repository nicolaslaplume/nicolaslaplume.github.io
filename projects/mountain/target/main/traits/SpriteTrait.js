define(["require", "exports", "traitEngine/Trait", "utils/Tween"], function (require, exports, Trait_1, Tween_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class default_1 extends Trait_1.default {
        constructor() {
            super(...arguments);
            this.Config = {
                img: ''
            };
            this.tweens = {};
        }
        Create() {
            this.sprite = PIXI.Sprite.fromFrame(this.Config.img);
            this.entity.game.stage.addChild(this.sprite);
        }
        AddTween(property, endValue, time) {
            this.tweens[property] = new Tween_1.default({
                startValue: this.sprite[property],
                endValue: endValue,
                totalTime: time,
                update: (value) => {
                    this.sprite[property] = value;
                }
            });
            return this.tweens[property];
        }
        Update() {
            var stillActive = {};
            _.each(this.tweens, (t, key) => {
                if (!t.Update()) {
                    stillActive[key] = t;
                }
            });
            this.tweens = stillActive;
        }
    }
    exports.default = default_1;
});
