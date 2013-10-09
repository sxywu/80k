define([
    "jquery",
    "underscore",
    "backbone",
    "app/collections/Positions.Collection",
    "app/views/Positions.View",
    "app/views/Chart.View"
], function(
    $,
    _,
    Backbone,
    PositionsCollection,
    PositionsView,
    ChartView
) {
    return Backbone.View.extend({
        initialize: function() {
            this.positionsView = new PositionsView({collection: new PositionsCollection()});

            this.chartView = new ChartView({positions: this.positionsView.collection});
        },
        render: function() {
            this.positionsView.render();
            this.chartView.render();
        }
    });
});