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
    var defaultPosition = "Station Agent";
    return Backbone.Collection.extend({
        model: PositionModel,
        fetch: function() {
            var that = this;
            d3.csv("data/bart-comp-all.csv", function(response) {
                var positions = [];
                // get managers
                _.chain(response)
                    .filter(function(position) {
                        return (position.Source === "MNP") &&
                            (position.Union !== "SEIU") &&
                            (position.Union !== "ATU");
                    }).groupBy(function(position) {
                        return position.Source;
                    }).each(function(val, key) {
                        if (val.length > 50) {
                            var obj = {};
                            obj.title = "Management*";
                            obj.raw = val;
                            obj.base = d3.mean(_.pluck(val, "Base"));
                            obj.overtime = d3.mean(_.pluck(val, "OT"));
                            obj.pension = (d3.mean(_.pluck(val, "EE")) + d3.mean(_.pluck(val, "ER"))) / 2;
                            obj.medical = d3.mean(_.pluck(val, "MDV"));
                            obj.other = d3.mean(_.pluck(val, "Other"));
                            positions.push(obj);
                        }
                    });

                // get union workers
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
                that.getPosition().set("showing", true);
            });
        },
        setPosition: function(position, silent) {
            defaultPosition = position;
            if (!silent) this.trigger("change:position");
        },
        getPosition: function() {
            return this.find(function(model) {
                return model.get("title") === defaultPosition;
            })
        }
    });
});