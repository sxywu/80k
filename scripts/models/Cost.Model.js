define([
    "jquery",
    "underscore",
    "backbone"
], function(
    $,
    _,
    Backbone
) {
    /*
    A model for the cost of living for a particular household size in a particular city.
    Attributes include:
        - id (ex: "SanFrancisco-4", for a household of 4 in SF)
        - housing
        - food
        - childcare
        - transportation
        - health care
        - other
        - taxes
    These figures are pulled from http://www.epi.org/resources/budget/

    */
    return Backbone.Model.extend({

    });
});