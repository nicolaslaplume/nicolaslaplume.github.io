define(["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HeightmapGenerator {
        static Generate(properties, seed) {
            var heights = [];
            _.defaults(properties, {
                size: 513,
                hills: 2000,
                minR: 5,
                maxR: 130,
                outsideX: 40
            });
            var data = {
                heights: [],
                params: properties,
                deltaR: properties.maxR - properties.minR,
                minX: 0 - properties.outsideX,
                deltaX: properties.size + 2 * properties.outsideX
            };
            Math.seedrandom(seed);
            _.times(properties.size, x => {
                var row = [];
                _.times(properties.size, y => {
                    row.push(0);
                });
                data.heights.push(row);
            });
            HeightmapGenerator.GenerateHiils(data);
            HeightmapGenerator.Normalize(data);
            return data.heights;
        }
        static GenerateHiils(data) {
            _.times(data.params.hills, () => {
                var px = Math.floor(Math.random() * data.deltaX + data.minX);
                var py = Math.floor(jStat.beta.sample(2, 2) * data.deltaX + data.minX);
                var r = Math.floor(Math.random() * data.deltaR + data.params.minR);
                for (var i = -r; i <= r; i++) {
                    for (var j = -r; j <= r; j++) {
                        var x = px + i, y = py + j;
                        if (x < 0 || y < 0 || x >= data.params.size || y >= data.params.size)
                            continue;
                        var dx = x - px, dy = y - py;
                        var z = r * r - (dx * dx + dy * dy);
                        if (z > 0) {
                            data.heights[x][y] += z;
                        }
                    }
                }
            });
        }
        static Normalize(data) {
            var minZ = data.heights[0][0], maxZ = data.heights[0][0];
            _.times(data.params.size, x => {
                _.times(data.params.size, y => {
                    var z = data.heights[x][y];
                    maxZ = Math.max(maxZ, z);
                    minZ = Math.min(minZ, z);
                });
            });
            var deltaZ = maxZ - minZ;
            _.times(data.params.size, x => {
                _.times(data.params.size, y => {
                    var z = data.heights[x][y];
                    z = (z - minZ) / deltaZ;
                    //Flatten
                    z = z * z;
                    data.heights[x][y] = z * data.params.maxH;
                });
            });
        }
    }
    exports.default = HeightmapGenerator;
});
