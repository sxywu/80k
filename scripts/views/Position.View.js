define([
    "jquery",
    "underscore",
    "backbone",
    "text!app/templates/Position.Template.html"
], function(
    $,
    _,
    Backbone,
    Template
) {
    return Backbone.View.extend({
        className: "position",
        initialize: function() {
            this.model = this.options.model;

            this.model.on("change:showing", _.bind(this.setShowing, this));
        },
        render: function() {
            this.$el.html(_.template(Template, this.model.attributes));
            this.$el.attr("name", this.model.get("title"));

            return this;
        },
        setShowing: function() {
            this.$el.addClass("showing");
        },
        events: {
            "click": "click"
        },
        click: function() {
            this.$el.trigger("position:clicked", [this.model.get("title")]);
            this.setShowing();
        }
    });
});