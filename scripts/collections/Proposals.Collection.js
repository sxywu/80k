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
    return Backbone.Collection.extend({
        model: ProposalModel
    });
});