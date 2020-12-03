require.config({
    baseUrl: 'target/main',
    paths: {
        //'underscore': '../../node_modules/underscore/underscore-min',
        'lodash': '../../node_modules/lodash/lodash.min',
        'pixi': '../../node_modules/pixi.js/dist/pixi',
        'text': '../../node_modules/requirejs-text/text',
        'jquery': '../../node_modules/jquery/dist/jquery.min',
        'tooltip': '../../lib/tooltip/tooltip.min',
        'rivets': '../../node_modules/rivets/dist/rivets',
        'sightglass': '../../node_modules/sightglass/index',
        'jqueryui': '../../lib/jquery-ui-1.12.1.custom/jquery-ui.min',
        'postal': '../../node_modules/postal/lib/postal',
        'jstat': '../../node_modules/jstat/dist/jstat.min',
        'seedrandom': '../../node_modules/seedrandom/seedrandom.min',
        'simplex-noise': '../../node_modules/simplex-noise/simplex-noise',
        'imgs': '../../src/img',
        'data': '../../src/data',
        'shaders': '../../src/shaders',
        'html': '../../src/templates'
    },
    shim: {
        'lodash': {
            exports: "_"
        },
        'jstat': {
            exports: "jStat"
        },
        'pixi': {
            exports: 'PIXI',
        },
        'sightglass': {
            exports: 'sightglass'
        },
        'rivets': {
            deps: ['sightglass'],
            exports: 'rivets'
        },
        'jqueryui': {
            deps: ['jquery']
        },
        'postal': {
            deps: ['lodash'],
            exports: 'postal'
        }
    }
});
require(['AppMain', 'postal', 'seedrandom', 'simplex-noise', 'jstat', 'jqueryui', 'sightglass', 'rivets', 'tooltip', 'pixi', 'lodash', 'jquery'
], (AppMain, postal) => {
    window['postal'] = postal;
    var app = new AppMain.default();
    app.Run();
});
