define([
    "jquery",
    "underscore",
    "d3",
    "d3.tip",
    "text!app/templates/ProposalHover.Template.html"
], function(
    $,
    _,
    d3,
    tip,
    ProposalHoverTemplate
) {
    return function() {
        var chart, data,
            yMax = 0.08,
            yMin = 0,
            tickValues = [0, 0.04, 0.08],
            width = 200,
            height = 75,
            padding = {right: 35, left: 10, top: 15, bottom: 15};

        function lineChart(selection) {
            var x = d3.scale.linear()
                    .domain([1, 4])
                    .range([0, width - (padding.right + padding.left)]),
                y = d3.scale.linear()
                    .domain([yMin, yMax])
                    .range([height - (padding.top + padding.bottom), 0]),
                yAxis = d3.svg.axis()
                    .scale(y).tickValues(tickValues)
                    .tickFormat(d3.format("%"))
                    .orient("right"),
                line = d3.svg.line()
                    .x(function(d, i) {return x(d.year); })
                    .y(function(d, i) {return y(d.rate)}),
                tip = d3.tip().attr('class', 'd3-tip')
                    .direction("e")
                    .html(function(d) {
                        return _.template(ProposalHoverTemplate, d); 
                    });

            chart = d3.select(selection).append("svg")
                .attr("width", width).attr("height", height);

            var axis = chart.append("g")
                .attr("class", "yAxis")
                .attr("transform", "translate(" + (width - padding.right) + "," + padding.top + ")")
                .call(yAxis);

            var line = chart.append("g")
                .attr("class", "line")
                .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                .selectAll("path")
                .data(data).enter().append("path")
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", function(d) {return app.colors[_.chain(d).pluck("party").uniq().value()]; });

            var circles = chart.append("g")
                .attr("class", "circles")
                .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                .selectAll("circle.dot")
                .data(_.flatten(data)).enter().append("circle")
                .attr("class", "dot")
                .attr("cx", function(d, i) {return x(d.year)})
                .attr("cy", function(d) {return y(d.rate)})
                .attr("r", 3)
                .attr("fill", function(d) {return app.colors[d.party]});

            var hoverCircles = chart.append("g")
                .attr("class", "hoverCircles")
                .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                .selectAll("circle.dotHover")
                .data(_.flatten(data)).enter().append("circle")
                .attr("class", "dotHover")
                .attr("cx", function(d, i) {return x(d.year)})
                .attr("cy", function(d) {return y(d.rate)})
                .attr("r", 10)
                .call(tip)
                .on("mouseover", tip.show)
                .on("mouseleave", tip.hide);

        }

        lineChart.data = function(value) {
            if (!arguments.length) return data;
            data = value;
            return lineChart;
        }

        lineChart.yMax = function(value) {
            if (!arguments.length) return yMax;
            yMax = value;
            tickValues = [yMin, (yMin + yMax) / 2, yMax];
            return lineChart;
        }

        lineChart.yMin = function(value) {
            if (!arguments.length) return yMin;
            yMin = value;
            tickValues = [yMin, (yMin + yMax) / 2, yMax];
            return lineChart;
        }

        return lineChart;
    }
});