define([
    "jquery",
    "underscore",
    "backbone",
    "app/models/Cost.Model"
], function(
    $,
    _,
    Backbone,
    CostModel
) {
    return Backbone.Collection.extend({
        model: CostModel
    });
});