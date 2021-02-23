define(["require", "exports", "tooltip"], function (require, exports, Tooltip) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class default_1 {
        constructor(game) {
            this.game = game;
            this.tooltip = new Tooltip('', {
                place: 'bottom',
                spacing: 20,
                auto: true
            });
            this.tooltip.effect('fade');
            $('body').mousemove((event) => {
                this.tooltip.position(event.clientX, event.clientY);
            });
        }
        Show(entity, text) {
            if (entity !== this.currentTooltip) {
                this.Hide(this.currentTooltip);
                this.currentTooltip = entity;
                this.tooltip.content(text);
                this.tooltip.show();
            }
        }
        Hide(entity) {
            if (entity === this.currentTooltip) {
                this.tooltip.hide();
                this.currentTooltip = null;
            }
        }
    }
    exports.default = default_1;
    rivets.binders['tooltip'] = (el, value) => {
        var $el = $(el);
        if ($el.data('tooltip')) {
            debugger;
        }
        var tooltip = new Tooltip(value, {
            typeClass: 'zIndexHigh'
        });
        tooltip.attach(el);
        tooltip.effect('fade');
        $el.hover(() => {
            tooltip.show();
        }, () => {
            tooltip.hide();
        });
        $el.data('tooltip', tooltip);
    };
});
