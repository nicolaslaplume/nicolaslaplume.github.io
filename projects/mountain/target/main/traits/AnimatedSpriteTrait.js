define(["require", "exports", "traits/SpriteTrait"], function (require, exports, SpriteTrait_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class default_1 extends SpriteTrait_1.default {
        constructor() {
            super(...arguments);
            this.Config = {
                img: '',
                animations: []
            };
            this.animations = {};
        }
        addClip(name) {
            this.animations[name] = [];
            for (var i = 0; i < 4; i++) {
                this.animations[name].push({
                    texture: PIXI.Texture.fromFrame(this.Config.img + name + i),
                    time: 100
                });
            }
        }
        Create() {
            _.each(this.Config.animations, a => {
                this.addClip(a);
            });
            this.sprite = new PIXI.extras.AnimatedSprite([PIXI.Texture.fromFrame(this.Config.img + this.Config.animations[0] + 0)]);
            this.entity.game.stage.addChild(this.sprite);
            //this.sprite.animationSpeed = 1;
            //this.sprite.onFrameChange;
            //this.sprite.onCompleted;
        }
        Play(animationName) {
            this.sprite.textures = this.animations[animationName];
            this.sprite.texture = this.sprite.textures[0];
            this.sprite.gotoAndPlay(0);
        }
    }
    exports.default = default_1;
});
