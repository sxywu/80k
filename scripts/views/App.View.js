define([
    "jquery",
    "underscore",
    "backbone",
    "bootstrap",
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
    bootstrap,
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
        el: "body",
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
        },
        events: {
            "click .shareURL": "shareURL",
            "blur .popover": "hidePopover",
            "change .secondIncomeToggle": "secondIncomeToggle",
            "click .editButton": "customize"
        },
        shareURL: function(e) {
            $(".shareURL").popover("show");
            $(".URLtoShare").val(document.URL.toString());
            $(".URLtoShare").select();
        },
        hidePopover: function() {
            $(".shareURL").popover("hide");
        },
        secondIncomeToggle: function(e) {
            app.secondIncome = $(e.target).is(":checked");
            this.costsView.collection.trigger("change");
        },
        customize: function(e) {
            var val = $(e.target).attr("name");
            if (val === "customizeCosts") {
                $("#householdSelect").val("Custom");
                $("#householdSelect").change();
            } else if (val === "customizeProposals") {
                $("#monthSelect").val("Custom");
                $("#monthSelect").change();
            }
        }
    });
});