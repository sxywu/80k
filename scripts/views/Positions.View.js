define([
    "jquery",
    "underscore",
    "backbone",
    "app/views/Position.View"
], function(
    $,
    _,
    Backbone,
    PositionView
) {
    return Backbone.View.extend({
        el: "#positionsContainer",
        initialize: function() {
            this.collection = this.options.collection;

            this.collection.on("reset", _.bind(this.renderAll, this));
            // this.collection.on("")
        },
        render: function() {
            this.collection.fetch();

            return this;
        },
        renderAll: function() {
            var that = this;
            this.collection.each(function(model) {
                that.renderOne(model);
            });
        },
        renderOne: function(model) {
            var view = new PositionView({model: model});
            this.$el.append(view.render().el);
        },
        events: {
            "position:clicked .position": "positionClicked"
        },
        positionClicked: function(e, position) {
            this.$(".position").removeClass("showing");
            this.collection.setPosition(position);
        }
    });
});