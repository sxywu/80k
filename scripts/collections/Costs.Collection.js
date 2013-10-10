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
                    }).value();

                that.reset(costs);
            });
        },
        /*
        get the default city and type
        */
        getDefault: function() {
            return defaultCost;
        },
        setShowingCity: function(city) {
            showingCost.city = city;

            this.trigger("change:city");
        },
        setShowingType: function(type) {
            showingCost.TYPE = type;

            this.trigger("change:type");
        },
        getCost: function() {
            return this.find(function(model) {
                return (model.get("City") === showingCost.city)
                    && (model.get("TYPE") === showingCost.TYPE);
            });
        }
    });
});