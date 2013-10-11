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
        getExpenses: function() {
            var irrelevant = ["Annual Total", "Monthly Total", "TYPE", "City"],
                json = {};
            _.each(this.attributes, function(val, key) {
                if (!_.contains(irrelevant, key)) {
                    json[key] = val;
                }
            });

            return json;
        },
        total: function() {
            var total = this.get("Annual Total");
            total = total.replace("$", "").replace(",", "");
            console.log(total);
            return parseInt(total);
        }
    });
});