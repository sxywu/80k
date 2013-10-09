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
        /*
        process the data for StackedBar, returning an array of objects:
            - starting (int)
            - ending (int)
            - opacity
        */
        processData: function() {
            var order = ["base", "other", "pension", "medical"],
                starting = 0,
                opacity = 1 / order.length,
                attributes = this.attributes,
                data = [];

            _.each(order, function(key, i) {
                var obj = {};
                obj.starting = starting;
                obj.ending = starting + attributes[key];
                obj.opacity = 1 - opacity * i;
                obj.title = key;

                starting = obj.ending;

                data.push(obj);
            });

            return data;
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