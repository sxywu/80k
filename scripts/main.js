require.config({
    baseUrl: "scripts/contrib/",
    paths: {
        "app": "..",
        "underscore": "underscore",
        "backbone": "backbone",
        "bootstrap": "bootstrap",
        "d3": "d3.v3"
    },
    shim: {
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        "d3": {
            exports: "d3"
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
    var appView = new AppView();
    appView.render();
});