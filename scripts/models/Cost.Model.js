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
                json = {},
                that = this;
            _.each(this.attributes, function(val, key) {
                if (!_.contains(irrelevant, key)) {
                    json[key] = that.toInt(val);
                }
            });

            return json;
        },
        monthlyTotal: function() {
            var that = this,
                sum = _.reduce(this.getExpenses(), function(memo, num) {
                    return that.toInt(num) + memo;
                }, 0);
            return sum;
        },
        total: function() {
            // var total = this.get("Annual Total");
            // total = total.replace("$", "").replace(",", "");
            return this.monthlyTotal() * 12;
        },
        toInt: function(str) {
            return (_.isString(str) ? parseInt(str.replace("$", "").replace(",", "")) : str);
        }

    });
});