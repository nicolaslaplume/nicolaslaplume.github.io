var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./main/SnowRenderer"], function (require, exports, SnowRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class default_1 {
        constructor(renderer) {
            this._entities = [];
            this.status = [];
            this.statusTime = 0;
            $('#generate').on('submit', () => {
                this.DrawMountain();
                return false;
            });
        }
        DrawMountain() {
            this.status = [];
            $('#maps').empty();
            this.Draw();
        }
        Draw() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                    var r = new SnowRenderer_1.default(this);
                    var txts = yield r.Draw($('#seed').val());
                    resolve(txts);
                }));
            });
        }
        Update() {
            this.UpdateText();
        }
        UpdateText() {
            this.statusTime++;
            if (this.statusTime % 60 === 0) {
                var text = '';
                _.each(this.status, s => {
                    if (s.done) {
                        text += `<p>${s.name}...Done (${_.floor(s.time)} ms)</p>`;
                    }
                    else {
                        text += `<p>${s.name}${_.repeat('.', Math.ceil(this.statusTime / 60))}</p>`;
                    }
                });
                $('#statusText').empty().append($(text));
            }
            if (this.statusTime >= 179)
                this.statusTime = 0;
        }
        newStatus(name) {
            var _beforeTime = performance.now();
            this.statusTime = 0;
            var entry = {
                name: name,
                done: false,
                time: 0
            };
            this.status.push(entry);
            return {
                done: () => {
                    entry.time = performance.now() - _beforeTime;
                    entry.done = true;
                }
            };
        }
    }
    exports.default = default_1;
});
