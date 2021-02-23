define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Entity {
        constructor(game) {
            this.game = game;
            this.traits = [];
            var EntityClass = this.constructor;
            _.each(EntityClass.Traits, T => {
                this.traits.push(new T(this));
            });
            this.game.AddUpdatableEntity(this);
        }
        CreateTraits() {
            _.each(this.traits, t => {
                t.Create();
            });
            _.each(this.traits, t => {
                t.AfterAllCreate();
            });
        }
        Update() {
            _.each(this.traits, t => {
                if (!t.disabled) {
                    t.Update();
                }
            });
        }
        FindTrait(TraitClass) {
            var trait = _.find(this.traits, t => {
                return t instanceof TraitClass;
            });
            if (trait instanceof TraitClass) {
                return trait;
            }
            else {
                throw 'Trait not Found!';
            }
        }
        HasTrait(TraitClass) {
            var EntityClass = this.constructor;
            var trait = _.find(this.traits, t => {
                return t instanceof TraitClass;
            });
            return !!trait;
        }
    }
    Entity.Traits = [];
    exports.default = Entity;
});
