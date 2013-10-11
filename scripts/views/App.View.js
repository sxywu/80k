define([
    "jquery",
    "underscore",
    "backbone",
    "app/collections/Positions.Collection",
    "app/collections/Costs.Collection",
    "app/collections/Proposals.Collection",
    "app/views/Positions.View",
    "app/views/Costs.View",
    "app/views/Proposals.View",
    "app/views/Chart.View"
], function(
    $,
    _,
    Backbone,
    PositionsCollection,
    CostsCollection,
    ProposalsCollection,
    PositionsView,
    CostsView,
    ProposalsView,
    ChartView
) {
    return Backbone.View.extend({
        initialize: function() {
            this.positionsView = new PositionsView({collection: new PositionsCollection()});
            this.costsView = new CostsView({collection: new CostsCollection()});
            this.proposalsView = new ProposalsView({collection: new ProposalsCollection});

            this.chartView = new ChartView({positions: this.positionsView.collection});
        },
        render: function() {
            this.positionsView.render();
            this.costsView.render();
            this.proposalsView.render();
            
            this.chartView.render();
        }
    });
});