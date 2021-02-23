var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "utils/Vector", "./HeightMapGenerator", "simplex-noise"], function (require, exports, Vector_1, HeightMapGenerator_1, SimplexNoise) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ambientRockColor = new Vector_1.default(40, 33, 33);
    var ambientColor = new Vector_1.default(83, 150, 203);
    var directColor = new Vector_1.default(29, 18, 10);
    var diffuseColor = new Vector_1.default(75, 42, 14);
    var specularColor = new Vector_1.default(68, 40, 23);
    ;
    class default_1 {
        constructor(game) {
            this.game = game;
            this.heightmap = [];
            this.shadowmap = [];
            this.normalmap = [];
            this.positionmap = [];
            this.noise = new SimplexNoise(new Math.seedrandom('noise'));
            this.light = (new Vector_1.default(1, -0.3, 0.6)).normalize();
            this.SIZE = 500;
            this.MAX_H = 200;
            window.Draw = (s) => {
                this.Draw(s);
            };
        }
        Draw(seed) {
            return __awaiter(this, void 0, void 0, function* () {
                this.generatHeightmap(seed);
                yield this.generateShadowmap();
                this.generateNormalmap();
                yield this.generateRender();
                var heightMap = this.createTexture((x, y) => {
                    var h = this.heightmap[x][this.SIZE - y - 1] * 255 / this.MAX_H;
                    var c = {
                        r: h, g: h, b: h, a: 255
                    };
                    return c;
                });
                var diffuseTxt = this.createTexture((x, y) => {
                    var posY = this.positionmap[x][this.SIZE - y - 1];
                    if (posY === -1) {
                        var h = 1 - y / this.SIZE;
                        return this._skyColor(h);
                    }
                    else {
                        var c = this._getColor(x, posY);
                        var dist = posY / this.SIZE;
                        dist = -240 * (dist * dist) * (-1 / 8 + dist * (5 / 12 + dist * (-1 / 2 + dist / 5)));
                        return {
                            r: c.r * dist,
                            g: c.g * dist,
                            b: c.b * dist,
                            a: 255
                        };
                    }
                });
                return {
                    diffuseTxt: diffuseTxt,
                    SIZE: this.SIZE
                };
            });
        }
        generatHeightmap(seed) {
            var entry = this.game.newStatus('Generating Heightmap');
            this.heightmap = HeightMapGenerator_1.default.Generate({
                size: this.SIZE,
                hills: 2000,
                maxH: this.MAX_H
            }, seed);
            entry.done();
        }
        generateShadowmap() {
            return __awaiter(this, void 0, void 0, function* () {
                var entry = this.game.newStatus('Generating Shadowmap');
                return new Promise((resolve) => {
                    var workerData = {
                        workers: 10,
                        next: 0,
                        renderMsg: 'renderShadow'
                    };
                    _.times(workerData.workers, () => {
                        var worker = new Worker('/projects/mountain/target/workers/workers/ShadowWorker.js');
                        this._handleRenderWorker(worker, workerData, () => {
                            entry.done();
                            resolve();
                        }, data => {
                            this.shadowmap[data.x] = data.y;
                        });
                        worker.postMessage({
                            type: 'init',
                            array: this.heightmap,
                            maxH: this.MAX_H,
                            light: {
                                x: this.light.x,
                                y: this.light.y,
                                z: this.light.z
                            }
                        });
                    });
                });
            });
        }
        generateNormalmap() {
            var entry = this.game.newStatus('Generating Normalmap');
            var normals = [];
            _.times(this.SIZE, x => {
                var row = [];
                _.times(this.SIZE, y => {
                    var c11 = this.heightmap[x][y];
                    var c01 = x === 0 ? c11 : this.heightmap[x - 1][y];
                    var c21 = x === this.heightmap.length - 1 ? c11 : this.heightmap[x + 1][y];
                    var c10 = y === 0 ? c11 : this.heightmap[x][y - 1];
                    var c12 = y === this.heightmap[x].length - 1 ? c11 : this.heightmap[x][y + 1];
                    var va = new Vector_1.default(2, 0, c21 - c01);
                    var vb = new Vector_1.default(0, 2, c12 - c10);
                    va = va.divide(va.length());
                    vb = vb.divide(vb.length());
                    var n = va.cross(vb).normalize();
                    row.push(n);
                });
                normals.push(row);
            });
            this.normalmap = normals;
            entry.done();
        }
        generateRender() {
            return __awaiter(this, void 0, void 0, function* () {
                var entry = this.game.newStatus('Rendering Raytracer');
                return new Promise((resolve) => {
                    var workerData = {
                        workers: 10,
                        next: 0,
                        renderMsg: 'render'
                    };
                    _.times(workerData.workers, () => {
                        var worker = new Worker('/projects/mountain/target/workers/workers/RendererWorker.js');
                        this._handleRenderWorker(worker, workerData, () => {
                            entry.done();
                            resolve();
                        }, data => {
                            this.positionmap[data.x] = data.y;
                        });
                        worker.postMessage({
                            type: 'init',
                            array: this.heightmap,
                            maxH: this.MAX_H
                        });
                    });
                });
            });
        }
        _averageNormal(cx, cy, midSize) {
            var t = 0;
            var v = new Vector_1.default(0, 0, 0);
            _.times(midSize * 2 + 1, i => {
                _.times(midSize * 2 + 1, j => {
                    var x = cx - midSize + i, y = cy - midSize + j;
                    if (x < 0)
                        x = 0;
                    if (y < 0)
                        y = 0;
                    if (x >= this.normalmap.length)
                        x = this.normalmap.length - 1;
                    if (y >= this.normalmap.length)
                        y = this.normalmap.length - 1;
                    t++;
                    v = v.add(this.normalmap[x][y]);
                });
            });
            return v.divide(t);
        }
        createTexture(iterColor) {
            var canvas = $('<canvas>')[0];
            canvas.width = this.SIZE;
            canvas.height = this.SIZE;
            var ctx = canvas.getContext('2d');
            var pixelCtx = ctx.getImageData(0, 0, this.SIZE, this.SIZE);
            _.times(this.SIZE, x => {
                _.times(this.SIZE, y => {
                    var pos = (y * 4 * this.SIZE) + x * 4;
                    var color = iterColor(x, y);
                    pixelCtx.data[pos + 0] = color.r;
                    pixelCtx.data[pos + 1] = color.g;
                    pixelCtx.data[pos + 2] = color.b;
                    pixelCtx.data[pos + 3] = color.a;
                });
            });
            ctx.putImageData(pixelCtx, 0, 0);
            $('#maps').append(canvas);
            return PIXI.Texture.fromCanvas(canvas);
        }
        _getColor(x, y) {
            var n = this.normalmap[x][y];
            var an = this._averageNormal(x, y, 3);
            var color;
            if (Math.abs(an.z) < 0.5)
                color = ambientRockColor.clone();
            else
                color = ambientColor.clone();
            if (!this.shadowmap[x][y]) {
                color = color.add(directColor);
            }
            var diffuse = Math.max(0, this.light.dot(n)) * 2;
            var specular = Math.max(this.noise.noise2D(x, y) * 0.5, 0);
            color = color.add(diffuseColor.multiply(diffuse));
            color = color.add(specularColor.multiply(specular));
            return {
                r: Math.floor(color.x),
                g: Math.floor(color.y),
                b: Math.floor(color.z)
            };
        }
        _handleRenderWorker(worker, workerData, resolve, done) {
            worker.onmessage = (msg) => {
                if (workerData.next < this.SIZE) {
                    worker.postMessage({
                        type: workerData.renderMsg,
                        x: workerData.next,
                        size: this.SIZE
                    });
                    workerData.next++;
                }
                else {
                    worker.terminate();
                    workerData.workers--;
                    if (workerData.workers === 0) {
                        resolve();
                    }
                }
                if (msg.data.type === 'done') {
                    done(msg.data);
                }
            };
        }
        _skyColor(h) {
            var r, g, b;
            var COLORS = [
                {
                    h: 0,
                    color: { r: 0, g: 0, b: 0 } //black
                },
                {
                    h: 0.5,
                    color: { r: 0, g: 0, b: 0 } //black
                },
                {
                    h: 0.7,
                    color: { r: 255, g: 255, b: 255 } //White
                },
                {
                    h: 0.85,
                    color: { r: 135, g: 206, b: 235 } //sky blue
                },
                {
                    h: 100,
                    color: { r: 135, g: 206, b: 235 } //sky blue
                }
            ];
            var firstC = COLORS[0], secondC = COLORS[1];
            _.each(COLORS, (c, i) => {
                if (h > c.h) {
                    firstC = c;
                    secondC = COLORS[i + 1];
                }
            });
            function lerp(a, b, x0, x1, x) {
                return a + (x - x0) * (b - a) / (x1 - x0);
            }
            return {
                r: lerp(firstC.color.r, secondC.color.r, firstC.h, secondC.h, h),
                g: lerp(firstC.color.g, secondC.color.g, firstC.h, secondC.h, h),
                b: lerp(firstC.color.b, secondC.color.b, firstC.h, secondC.h, h),
                a: 255
            };
        }
    }
    exports.default = default_1;
});
