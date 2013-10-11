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
        gotCosts = false;
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
        },
        render: function() {
            console.log("reset!");

            this.chart.data(this.processData());
            this.chart(this.$("#chart")[0]);
            this.chart.legend(this.$("#legend")[0]);

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
                raises = _.chain(proposal.getLineData().raise)
                    .flatten().groupBy("party").value(),
                pensions = _.chain(proposal.getLineData().pension)
                    .flatten().groupBy("party").value(),
                lastBART = _.clone(position.attributes),
                lastUnion = _.clone(position.attributes),
                costTotal = cost.total(),
                inflation = 1.02, // assumption right now
                data = [{
                    bars: [this.processPositionData(lastBART, "BART"), this.processPositionData(lastUnion, "Union")],
                    cost: costTotal
                }],
                that = this;

            _.each([0, 1, 2, 3], function(i) {
                var obj = {};
                lastBART.base += (raises.BART[i] ? (lastBART.base * raises.BART[i].rate) : 0);
                lastBART.pension = (pensions.BART[i] ? (lastBART.base * pensions.BART[i].rate) : lastBART.pension);
                lastUnion.base += (raises.Union[i] ? (lastUnion.base * raises.Union[i].rate) : 0);
                lastUnion.pension = (pensions.Union[i] ? (lastUnion.base * pensions.Union[i].rate) : lastUnion.pension);
                obj.bars = [that.processPositionData(lastBART, "BART"), that.processPositionData(lastUnion, "Union")];
                obj.cost = costTotal * Math.pow(inflation, i + 1);

                data.push(obj);
            });

            console.log(data);
            return data;

        },
        processPositionData: function(attributes, party) {
            var order = ["base", "other", "pension", "medical"],
                starting = 0,
                opacity = 1 / order.length,
                data = [];

            _.each(order, function(key, i) {
                var obj = {};
                obj.starting = starting;
                obj.ending = starting + attributes[key];
                obj.height = attributes[key];
                obj.opacity = 1 - opacity * i;
                obj.title = key;
                obj.party = party;

                starting = obj.ending + 1;

                data.push(obj);
            });

            return data;
        },
    });
});