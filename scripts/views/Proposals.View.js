define([
    "jquery",
    "underscore",
    "backbone",
    "text!app/templates/Proposal.Template.html",
    "app/models/Proposal.Model",
    "app/visualizations/LineChart.Visualization"
], function(
    $,
    _,
    Backbone,
    ProposalTemplate,
    ProposalModel,
    LineChartVisualization
) {
    return Backbone.View.extend({
        el: "#proposalsContainer",
        initialize: function() {
            this.collection = this.options.collection;
            this.charts = {};

            this.collection.on("reset", _.bind(this.renderOne, this));
            this.collection.on("change", _.bind(this.update, this));
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
                chart.key(key).data(category).yMax(parseFloat(yMax)).yMin(parseFloat(yMin));
                chart(that.$("." + key + "Chart")[0]);

                that.charts[key] = chart;
            });
        },
        update: function(duration) {
            var model = this.collection.getProposal(),
                data = model.getLineData(),
                that = this;

            _.each(data, function(category, key) {
                var chart = that.charts[key];
                chart.data(category);
                chart.update(duration);
            });   

            if (model.get("month") === "Custom") {
                this.manualCustom();
            }
        },
        dragUpdate: function(e, key, array) {
            var model = this.collection.getProposal();
            model.set(key, array);
        },
        events: {
            "change #monthSelect": "setMonth",
            "chart:update svg": "dragUpdate",
            "updateURL svg": "updateURL"
        },
        setMonth: function(e) {
            var val = $(e.target).val();

            app.editable = (val === "Custom" ? true : false);
            if (val === "Custom") {
                app.editable = true;
                $(".editButton[name='customizeProposals']").addClass("disabled");
            } else {
                app.editable = false;
                $(".editButton[name='customizeProposals']").removeClass("disabled");
            }
            _.each(this.charts, function(val, key) {
                if (app.editable) {
                    val.editing();
                } else {
                    val.notEditing();
                }
            });
            this.collection.setMonth(val);
        },
        /* this function is for when in custom mode, and when dragging has
        ended, the URL can update with the new number */
        updateURL: function() {
            this.collection.trigger("change");
        },
        manualCustom: function() {
            app.editable = true;
            _.each(this.charts, function(val, key) {
                if (app.editable) {
                    val.editing();
                } else {
                    val.notEditing();
                }
            });
        }
    });
});