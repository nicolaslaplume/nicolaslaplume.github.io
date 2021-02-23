define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class default_1 {
        constructor(game) {
            this.game = game;
            this.dialogs = [];
        }
        FindById(id) {
            return _.find(this.dialogs, (d) => {
                return d.id === id;
            });
        }
        Open(id) {
            this.Close().then(() => {
                this.currentDialog = this.FindById(id);
                if (this.currentDialog) {
                    this.game.renderer.view.classList.add('blur');
                    this.currentDialog.Show();
                    this.currentDialog.$dialog.removeClass('dialog--hidden');
                }
            });
        }
        Close() {
            return $.Deferred((deferred) => {
                if (this.currentDialog) {
                    this.game.renderer.view.classList.remove('blur');
                    this.currentDialog.$dialog.addClass('dialog--hidden');
                    setTimeout(() => {
                        this.currentDialog.Hide();
                        this.currentDialog = null;
                        deferred.resolve();
                    }, 500);
                }
                else {
                    deferred.resolve();
                }
            });
        }
    }
    exports.default = default_1;
});
