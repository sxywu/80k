define([
    "jquery",
    "underscore",
    "backbone",
    "d3",
    "app/visualizations/StackedBar.Visualization"
], function(
    $,
    _,
    Backbone,
    d3,
    StackedBarVisualization
) {
    return Backbone.View.extend({
        el: "#chartContainer",
        initialize: function() {
            this.positions = this.options.positions; // positionsCollection

            this.positions.on("reset", _.bind(this.renderPositions, this));
        },
        render: function() {
            this.renderPositions();


        },
        renderPositions: function() {
            var that = this,
                max = _.chain(this.positions.models)
                    .map(function(model) { 
                        return model.total();
                    }).max().value();

            console.log(max);
            this.positions.each(function(model, i) {
                console.log(model);
                var data = {bars: model.processData(), transform: i},
                    component = new StackedBarVisualization();

                component.data(data).max(max);
                component(that.el);

            });
        }
    });
});