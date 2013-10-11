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
        fetch: function() {
            var that = this;
            d3.csv("data/proposals.csv", function(data) {
                that.reset(data);
            });
        },
        setMonth: function(month) {
            defaultMonth = month;
        },
        getProposal: function() {
            return this.find(function(proposal) {
                return proposal.get("month") === defaultMonth;
            });
        }
    });
});