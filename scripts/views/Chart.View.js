define([
    "jquery",
    "underscore",
    "backbone",
    "d3",
    "app/visualizations/StackedBar.Visualization"
], function(
    $,
    _,
    Backbone,
    d3,
    StackedBarVisualization
) {
    var gotPositions = false,
        gotProposals = false,
        gotCosts = false,
        inflation = 1.02; // assumption right now
    return Backbone.View.extend({
        el: "#chartContainer",
        initialize: function() {
            this.positions = this.options.positions; // positionsCollection
            this.proposals = this.options.proposals; // proposalsCollection
            this.costs = this.options.costs; // costsCollection
            this.chart = new StackedBarVisualization();

            this.positions.on("reset", _.bind(this.resetPositions, this));
            this.proposals.on("reset", _.bind(this.resetProposals, this));
            this.costs.on("reset", _.bind(this.resetCosts, this));

            this.positions.on("change", _.bind(this.update, this));
            this.costs.on("change", _.bind(this.update, this));
            this.proposals.on("change", _.bind(this.update, this));
        },
        render: function() {
            var employeePosition = this.positions.getPosition().get("title").replace("_", " ");
            this.$(".employeePosition").html(employeePosition);
            this.chart.data(this.processData());
            this.chart(this.$("#chart")[0]);
            this.chart.legend(this.$("#legend")[0]);

            this.trigger("rendered");
        },
        update: function(duration) {
            var employeePosition = this.positions.getPosition().get("title").replace("_", " ");
            this.$(".employeePosition").html(employeePosition);
            this.chart.data(this.processData());
            this.chart.update(duration);
        },
        resetPositions: function() {
            if (gotProposals && gotCosts) {
                this.render();
            } else {
                gotPositions = true;
            }
        },
        resetProposals: function() {
            if (gotPositions && gotCosts) {
                this.render();
            } else {
                gotProposals = true;
            }
        },
        resetCosts: function() {
            if (gotPositions && gotProposals) {
                this.render();
            } else {
                gotCosts = true;
            }
        },
        processData: function() {
            var position = this.positions.getPosition(),
                cost = this.costs.getCost(),
                proposal = this.proposals.getProposal(),
                raises = _.chain(proposal.getLineData().Raise)
                    .flatten().groupBy("party").value(),
                pensions = _.chain(proposal.getLineData().Pension)
                    .flatten().groupBy("party").value(),
                lastBART = _.clone(position.attributes),
                lastUnion = _.clone(position.attributes),
                costTotal = cost.total(),
                data = [{
                    bars: [this.processPositionData(lastBART, "BART", 0), this.processPositionData(lastUnion, "Union", 0)],
                    cost: costTotal
                }],
                that = this;

            _.each([0, 1, 2, 3], function(i) {
                var obj = {};
                lastBART.base += (raises.BART[i] ? (lastBART.base * raises.BART[i].rate) : 0);
                lastBART.pension = (pensions.BART && pensions.BART[i] ? (lastBART.base * pensions.BART[i].rate) : lastBART.pension);
                lastUnion.base += (raises.Union[i] ? (lastUnion.base * raises.Union[i].rate) : 0);
                lastUnion.pension = (pensions.Union && pensions.Union[i] ? (lastUnion.base * pensions.Union[i].rate) : lastUnion.pension);
                obj.bars = [that.processPositionData(lastBART, "BART", i), that.processPositionData(lastUnion, "Union", i)];
                obj.cost = costTotal * Math.pow(inflation, i + 1);

                data.push(obj);
            });

            return data;

        },
        /*
        process the data for StackedBar, returning an array of objects:
            - starting (int)
            - ending (int)
            - opacity
        */
        processPositionData: function(attributes, party, i) {
            var order = ["base", "other", "pension", "medical"],
                starting = 0,
                opacity = .3 / (order.length - 1),
                data = [];

            if (app.secondIncome) {
                data.push({
                    starting: starting,
                    ending: starting + app.medianIncome * Math.pow(inflation, i + 1),
                    height: app.medianIncome * Math.pow(inflation, i + 1),
                    opacity: .5,
                    title: "spouse",
                    party: "other"
                });

                starting = starting + app.medianIncome * Math.pow(inflation, i + 1) + 1;

            }

            _.each(order, function(key, i) {
                var obj = {};
                obj.starting = starting;
                obj.ending = starting + attributes[key];
                obj.height = attributes[key];
                obj.opacity = 1 - (i > 0 ? .7 : 0) - (opacity * (i - 1));
                obj.title = key;
                obj.party = party;

                starting = obj.ending + 1;

                data.push(obj);
            });

            return data;
        },
    });
});