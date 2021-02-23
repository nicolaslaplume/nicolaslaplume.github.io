define(["require", "exports", "game/Game"], function (require, exports, Game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AppMain {
        constructor() {
            this.Update = (() => {
                requestAnimationFrame(this.Update);
                this.game.Update();
            }).bind(this);
        }
        Run() {
            this.game = new Game_1.default(this.renderer);
            requestAnimationFrame(this.Update);
        }
        Preload() {
        }
    }
    exports.default = AppMain;
});
