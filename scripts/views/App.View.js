define([
    "jquery",
    "underscore",
    "backbone",
    "app/collections/Positions.Collection",
    "app/views/Positions.View"
], function(
    $,
    _,
    Backbone,
    PositionsCollection,
    PositionsView
) {
    return Backbone.View.extend({
        initialize: function() {
            this.positionsView = new PositionsView({collection: new PositionsCollection()});
        },
        render: function() {
            this.positionsView.render();
        }
    });
});