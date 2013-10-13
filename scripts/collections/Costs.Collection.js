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
    var cities = {
        "Oakland-Fremont, CA HUD Metro FMR Area": "Oakland, Fremont",
        "San Francisco, CA HUD Metro FMR Area": "San Francisco",
        "San Jose-Sunnyvale-Santa Clara, CA HUD Metro FMR Area": "San Jose, Sunnyvale, Santa Clara",
        "Vallejo-Fairfield, CA MSA": "Vallejo/Fairfield"
    },
    defaultCost = {
        city: "San Francisco",
        TYPE: "2P2C"
    },
    showingCost = _.clone(defaultCost);
    return Backbone.Collection.extend({
        model: CostModel,
        initialize: function() {
            this.showingCost = showingCost;
            this.defaultCost = defaultCost;

            this.on("reset", _.bind(this.updateModels, this));
        },
        fetch: function() {
            var that = this;
            d3.csv("data/ca-family-budget.csv", function(response) {
                var costs = _.chain(response)
                        .filter(function(cost) {
                            return _.contains(_.keys(cities), cost.AREANAME);
                        }).map(function(cost) {
                            cost.City = cities[cost.AREANAME];
                            delete cost.AREANAME;
                            delete cost.STATE;

                            return cost;
                        }).value(),
                    custom = _.chain(costs)
                        .find(function(d) {
                            return (d.City === showingCost.city)
                                && (d.TYPE === showingCost.TYPE);
                        }).clone().value();
                custom.City = "Custom";
                custom.TYPE = "Custom";
                costs.push(custom);
                that.reset(costs);
            });
        },
        /*
        get the default city and type
        */
        getDefault: function() {
            return defaultCost;
        },
        setShowingCity: function(city, options) {
            options = options || {};
            if (showingCost.city === "Custom") {
                showingCost.TYPE = defaultCost.TYPE;
            }
            showingCost.city = city;

            if (city === "Custom") {
                showingCost.TYPE = "Custom";
            } else if (!options.silent) {
                this.trigger("change");
            }
        },
        setShowingType: function(type, options) {
            options = options || {};
            if (showingCost.TYPE === "Custom") {
                showingCost.city = defaultCost.city;
            }
            showingCost.TYPE = type;

            if (type === "Custom") {
                showingCost.city = "Custom";
            } else if (!options.silent) {
                this.trigger("change");
            }
        },
        getShowingCity: function() {
            return showingCost.city;
        },
        getShowingType: function() {
            return showingCost.TYPE;
        },
        getCost: function() {
            return this.find(function(model) {
                return (model.get("City") === showingCost.city)
                    && (model.get("TYPE") === showingCost.TYPE);
            });
        },
        updateModels: function() {
            var that = this;

            this.each(function(model) {
                model.on("change", function() {
                    console.log("trigger");
                    that.trigger("change");
                });
            });
        }
    });
});