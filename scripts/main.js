require.config({
    baseUrl: "scripts/contrib/",
    paths: {
        "app": "..",
        "underscore": "underscore",
        "backbone": "backbone",
        "bootstrap": "bootstrap",
        "d3": "d3.v3",
        "d3.tip": "d3.tip"
    },
    shim: {
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        bootstrap: {
            deps: ["jquery"]
        },
        "d3": {
            exports: "d3"
        },
        "d3.tip": {
            deps: ["d3"],
            exports: "d3.tip"
        }
    }
});

require([
    "jquery",
    "underscore",
    "backbone",
    "app/views/App.View"
], function(
    $,
    _,
    Backbone,
    AppView
) {
    app = {};
    app.colors = {BART: "#2667B7", Union: "#F48512", other: "#cfcfcf",
        darkGreen: "#859900", green: "#BEF202", red: "#dc322f"};
    app.editable = false; // when editing line chart
    app.dragging = false; // when dragging line chart
    app.secondIncome = true; 
    app.medianIncome = 36485.75; // median income for bay area
    app.hoverLineTarget = false;
    var appView = new AppView();
    appView.render();
});