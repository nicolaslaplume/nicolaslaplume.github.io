define(["require", "exports", "traitEngine/Entity", "../../rivet-formatters/GeneralFormatters"], function (require, exports, Entity_1, GeneralFormatters_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    GeneralFormatters_1.default();
    class default_1 extends Entity_1.default {
        constructor(game, template) {
            super(game);
            this.template = template;
            this.id = '';
            this.vm = {};
            this.formattersAdded = false;
            this.parent = '.dialog-area';
            this.CreateTraits();
            this.gameModel = this.game.gameModel;
        }
        AddFormatters() {
            this.formattersAdded = true;
            _.each(this.formatters, (formatter, key) => {
                if (!!rivets.formatters[key]) {
                    throw `Formatter '${key}' already exists!`;
                }
                rivets.formatters[key] = formatter;
            });
        }
        BeforeOpen() { }
        AfterClose() { }
        AddEvents() {
            if (!this.formattersAdded) {
                this.AddFormatters();
            }
            rivets.bind(this.$dialog, this);
        }
        Show() {
            this.$dialog = $(this.template);
            this.BeforeOpen();
            $(this.parent).append(this.$dialog);
            this.AddEvents();
        }
        Hide() {
            this.$dialog.remove();
            this.AfterClose();
        }
    }
    exports.default = default_1;
});
