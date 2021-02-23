/// <reference path="workerModules.d.ts"/>
var exports = {};
importScripts('../main/utils/Vector.js', 'utils/utils.js');
var array = [];
var N = 0;
var MAX_H = 0;
var angle = 30;
var cy = -800;
var cz = 350;
angle = -angle * Math.PI / 180;
onmessage = function (e) {
    if (e.data.type === 'init') {
        array = e.data.array;
        N = array.length;
        MAX_H = e.data.maxH;
        postMessage({
            type: 'initDone'
        });
    }
    if (e.data.type === 'render') {
        var renderArray = [];
        var rayD = new Vector(0, 1, Math.tan(angle));
        var alpha = Math.PI / 2 + angle;
        var calls = 0;
        Utils.times(e.data.size, (y) => {
            var dz = Math.sin(alpha) * y;
            var dy = Math.cos(alpha) * y;
            var rayO = new Vector(e.data.x, cy + dy, cz + dz);
            var rayY = -cy - dy;
            var rayZ = rayO.add(rayD.multiply(rayY + N));
            if (rayZ.z > MAX_H) {
                renderArray.push(-1);
                return;
            }
            var found = false;
            while (true) {
                var ray = rayO.add(rayD.multiply(rayY));
                if (ray.z < 0 || ray.y >= N) {
                    break;
                }
                var diff = ray.z - array[e.data.x][Math.floor(ray.y)];
                calls++;
                if (Math.abs(diff) < 5) {
                    found = true;
                    break;
                }
                rayY += diff / 5;
                if (isNaN(rayY)) {
                    break;
                }
            }
            if (found) {
                renderArray.push(Math.floor(ray.y));
            }
            else {
                renderArray.push(-1);
            }
        });
        postMessage({
            type: 'done',
            x: e.data.x,
            y: renderArray,
            calls: calls
        });
    }
};
//# sourceMappingURL=RendererWorker.js.map