define([
    "jquery",
    "underscore",
    "backbone",
    "app/models/Proposal.Model"
], function(
    $,
    _,
    Backbone,
    ProposalModel
) {
    var defaultMonth = "August",
        parties = {
            "BR": "Raise,BART",
            "UR": "Raise,Union",
            "BP": "Pension,BART",
            "UP": "Pension,Union",
            "BM": "Medical,BART",
            "UM": "Medical,Union"
        },
        invertedParties = _.invert(parties);
    return Backbone.Collection.extend({
        model: ProposalModel,
        initialize: function() {
            this.on("reset", _.bind(this.updateModels, this));
        },
        fetch: function() {
            var that = this;
            d3.csv("data/proposals.csv", function(data) {
                var custom = _.chain(data)
                    .find(function(d) {
                        return d.month === defaultMonth;
                    }).clone().value();

                custom.month = "Custom";
                data.push(custom);
                that.reset(data);
            });
        },
        setMonth: function(month, options) {
            options = options || {};
            defaultMonth = month;
            if (!options.silent) {
                this.trigger("change");
            }
        },
        getMonth: function(month) {
            return defaultMonth;
        },
        getProposal: function() {
            return model = this.find(function(proposal) {
                return proposal.get("month") === defaultMonth;
            });
        },
        updateModels: function() {
            var that = this,
                duration = 0;

            this.each(function(model) {
                model.on("change", function() {
                    that.trigger("change", duration);
                });
            });
        },
        setCustomURL: function(custom) {
            // http://localhost:8888/80k/#custom/proposals/1P1C/VF/System_Service Worker/BR-9a10a8a5,UR-5.2a6a7
            var model = this.getProposal(),
                attrs = {};
            _.each(custom.split(","), function(attr) {
                    var kv = attr.split("_"),
                        key = parties[kv[0]],
                        val = kv[1].split("a");
                    attrs[key] = val;

            });

            model.set(attrs);
            this.trigger("change");
        },
        getCustomURL: function() {
            var model = this.getProposal(),
                length = _.keys(model.attributes).length,
                i = 0,
                str = "";

            _.each(model.attributes, function(val, key) {
                str += (key !== "month" ? (invertedParties[key] + "_") : "");
                str += (val !== "Custom" ? val.join("a") : "");

                if (i < length - 1) {
                    str += (key !== "month" ? "," : "");
                }
                i += 1;
            });

            return str;
        }
    });
});