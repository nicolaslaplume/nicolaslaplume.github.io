define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class default_1 {
        constructor(game) {
            this.game = game;
            this._pivot = new PIXI.Point(0, 0);
            this._offset = new PIXI.Point(0, 0);
            this._scale = 1;
            this._rotation = 0;
        }
        get pivot() { return this._pivot; }
        set pivot(p) { this._pivot = p; this.UpdateMatrix(); }
        get offset() { return this._offset; }
        set offset(p) { this._offset = p; this.UpdateMatrix(); }
        get scale() { return this._scale; }
        set scale(n) { this._scale = n; this.UpdateMatrix(); }
        get rotation() { return this._rotation; }
        set rotation(n) { this._rotation = n; this.UpdateMatrix(); }
        ToScreen(point) {
            return this.game.stage.toGlobal(point);
        }
        ToWorld(point) {
            return this.game.stage.toLocal(point);
        }
        GetViewport() {
            var p0 = this.ToWorld(new PIXI.Point(0, 0)), p1 = this.ToWorld(new PIXI.Point(this.game.renderer.width, this.game.renderer.height));
            return {
                x: p0.x,
                y: p0.y,
                w: p1.x - p0.x,
                h: p1.y - p0.y
            };
        }
        UpdateMatrix() {
            this.game.stage.setTransform(Math.round(this.game.renderer.width / 2 - this._offset.x), Math.round(this.game.renderer.height / 2 - this._offset.y), this._scale, this._scale, this._rotation, 0, 0, this._pivot.x, this._pivot.y);
        }
    }
    exports.default = default_1;
});
