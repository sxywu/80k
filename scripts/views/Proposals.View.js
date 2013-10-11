define([
    "jquery",
    "underscore",
    "backbone",
    "text!app/templates/Proposal.Template.html",
    "app/visualizations/LineChart.Visualization"
], function(
    $,
    _,
    Backbone,
    ProposalTemplate,
    LineChartVisualization
) {
    return Backbone.View.extend({
        el: "#proposalsContainer",
        initialize: function() {
            this.collection = this.options.collection;
            this.charts = {};

            this.collection.on("reset", _.bind(this.renderOne, this));
        },
        render: function() {
            this.collection.fetch();

            return this;
        },
        renderOne: function() {
            var model = this.collection.getProposal(),
                data = model.getLineData(),
                yMax = _.chain(data).values().flatten()
                    .pluck("rate").max().value(),
                yMin = _.chain(data).values().flatten()
                    .pluck("rate").min().value(),
                that = this;

            _.each(data, function(category, key) {
                that.$("#proposalContainer").append(_.template(ProposalTemplate, {key: key}));
                var chart = new LineChartVisualization();
                chart.data(category).yMax(parseFloat(yMax)).yMin(parseFloat(yMin));
                chart(that.$("." + key + "Chart")[0]);

                that.charts[key] = chart;
            });   
        },
        update: function() {
            var model = this.collection.getProposal(),
                data = model.getLineData(),
                that = this;

            _.each(data, function(category, key) {
                var chart = that.charts[key];
                chart.data(category);
                chart.update();
            });   
        },
        events: {
            "change #monthSelect": "setMonth",
        },
        setMonth: function(e) {
            var val = $(e.target).val();
            this.collection.setMonth(val);
            this.update();
        }
    });
});