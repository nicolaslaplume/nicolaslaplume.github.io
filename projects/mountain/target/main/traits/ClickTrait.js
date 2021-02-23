define(["require", "exports", "traitEngine/Trait", "./SpriteTrait"], function (require, exports, Trait_1, SpriteTrait_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class default_1 extends Trait_1.default {
        constructor() {
            super(...arguments);
            this.Config = {
                context: this,
                OnClick: (clickEvent) => { },
                OnMouseOver: (clickEvent) => { },
                OnMouseOut: (clickEvent) => { }
            };
        }
        AfterAllCreate() {
            var sprite = this.FindTrait(SpriteTrait_1.default);
            sprite.sprite.interactive = true;
            sprite.sprite.on('click', this.Config.OnClick.bind(this.Config.context));
            sprite.sprite.on('mouseover', this.Config.OnMouseOver.bind(this.Config.context));
            sprite.sprite.on('mouseout', this.Config.OnMouseOut.bind(this.Config.context));
        }
    }
    default_1.Dependencies = [SpriteTrait_1.default];
    exports.default = default_1;
});
