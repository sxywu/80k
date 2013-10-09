define([
    "jquery",
    "underscore",
    "backbone",
    "d3",
    "app/models/Position.Model"
], function(
    $,
    _,
    Backbone,
    d3,
    PositionModel
) {
    return Backbone.Collection.extend({
        model: PositionModel,
        // url: "data/bart-comp-all.csv",
        fetch: function() {
            var that = this;
            d3.csv("data/bart-comp-all.csv", function(response) {
                var positions = [];
                _.chain(response)
                    .filter(function(position) {
                        return (position.Union === "SEIU") || (position.Union === "ATU");
                    }).groupBy(function(position) {
                        return position.Title;
                    }).each(function(val, key) {
                        if (val.length > 50) {
                            var obj = {};
                            obj.title = key;
                            obj.raw = val;
                            obj.base = d3.mean(_.pluck(val, "Base"));
                            obj.overtime = d3.mean(_.pluck(val, "OT"));
                            obj.pension = (d3.mean(_.pluck(val, "EE")) + d3.mean(_.pluck(val, "ER"))) / 2;
                            obj.medical = d3.mean(_.pluck(val, "MDV"));
                            obj.other = d3.mean(_.pluck(val, "Other"));
                            positions.push(obj);
                        }
                    });

                that.reset(positions);
            });
        }
    });
});