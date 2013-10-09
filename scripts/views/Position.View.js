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


        },
        render: function() {
            this.$el.html(_.template(Template, this.model.attributes));

            return this;
        }
    });
});