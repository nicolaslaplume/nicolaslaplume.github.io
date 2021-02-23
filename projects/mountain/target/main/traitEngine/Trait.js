define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Trait {
        constructor(entity) {
            this.entity = entity;
            var TraitClass = this.constructor;
            _.each(TraitClass.Dependencies, D => {
                if (!this.entity.HasTrait(D)) {
                    throw 'Dependency not match';
                }
            });
        }
        FindTrait(TraitClass) {
            var TraitClassThis = this.constructor;
            if (!_.includes(TraitClassThis.Dependencies, TraitClass)) {
                throw 'Trait Not in Dependency';
            }
            return this.entity.FindTrait(TraitClass);
        }
        Create() { }
        AfterAllCreate() { }
        Update() { }
    }
    Trait.Dependencies = [];
    exports.default = Trait;
});
