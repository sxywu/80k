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
    "app/views/Chart.View",
    "app/routers/App.Router"
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
    ChartView,
    AppRouter
) {
    return Backbone.View.extend({
        initialize: function() {
            this.positionsView = new PositionsView({collection: new PositionsCollection()});
            this.costsView = new CostsView({collection: new CostsCollection()});
            this.proposalsView = new ProposalsView({collection: new ProposalsCollection});

            this.chartView = new ChartView({
                positions: this.positionsView.collection,
                proposals: this.proposalsView.collection,
                costs: this.costsView.collection
            });

            this.router = new AppRouter({
                chart: this.chartView
            })

            Backbone.history.start();
        },
        render: function() {
            this.positionsView.render();
            this.proposalsView.render();
            this.costsView.render();
        }
    });
});