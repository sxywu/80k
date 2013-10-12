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
    var defaultMonth = "August";
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
        setMonth: function(month) {
            defaultMonth = month;
            this.trigger("change");
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
        }
    });
});