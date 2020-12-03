/// <reference path="workerModules.d.ts"/>
var exports = {};
importScripts('../main/utils/Vector.js', './utils/utils.js');
var array = [];
var N = 0;
var light, maxH;
onmessage = function (e) {
    if (e.data.type === 'init') {
        array = e.data.array;
        N = array.length;
        maxH = e.data.maxH;
        light = new Vector(e.data.light.x, e.data.light.y, e.data.light.z);
        postMessage({
            type: 'initDone'
        });
    }
    if (e.data.type === 'renderShadow') {
        var shadowsArray = [];
        Utils.times(e.data.size, (y) => {
            var h = array[e.data.x][y];
            var current = new Vector(e.data.x, y, h);
            var shadowed = false;
            while (true) {
                current = current.add(light);
                var lerpX = Math.round(current.x), lerpY = Math.round(current.y);
                if (lerpX < 0 || lerpY < 0 || lerpX >= N || lerpY >= N || current.z > maxH)
                    break;
                if (current.z <= array[lerpX][lerpY]) {
                    shadowed = true;
                    break;
                }
            }
            shadowsArray.push(shadowed);
        });
        postMessage({
            type: 'done',
            x: e.data.x,
            y: shadowsArray
        });
    }
};
//# sourceMappingURL=ShadowWorker.js.map