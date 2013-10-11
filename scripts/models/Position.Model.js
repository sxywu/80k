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
    A model of a BART job category, and its associated median salaries
    attributes:
        - base: base salary
        - overtime
        - other: vacation, sick leave, bonuses, etc.
        - pension: ER + EE
        - medical: MDV
        - source
        - Job Family
    data source: https://github.com/enjalot/bart/blob/master/data/bart-comp-all.csv
    description of attributes: https://github.com/enjalot/bart/tree/master/data
    */
    return Backbone.Model.extend({
        initialize: function() {

        },
        total: function() {
            var keys = ["medical", "pension", "other", "base"],
                sum = 0,
                attributes = this.attributes;
            _.each(keys, function(key) {
                sum += attributes[key];
            });

            return sum;
        }
    });
});