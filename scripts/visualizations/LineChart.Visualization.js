define([
    "jquery",
    "underscore",
    "d3",
    "d3.tip"
], function(
    $,
    _,
    d3,
    tip
) {
    return function() {
        var chart, data = [[.05, .061, .072, .072], [.02, .02, .025, .025]],
            tickValues = [0, 0.04, 0.08],
            yMax = 0.08,
            width = 200,
            height = 75,
            padding = 30;

        function lineChart(selection) {
            var x = d3.scale.linear()
                    .domain([1, 4])
                    .range([0, width - 2 * padding]),
                y = d3.scale.linear()
                    .domain([0, yMax])
                    .range([height - padding, 0]),
                yAxis = d3.svg.axis()
                    .scale(y).tickValues(tickValues)
                    .tickFormat(d3.format("%"))
                    .orient("right"),
                line = d3.svg.line()
                    .x(function(d, i) {return x(i + 1); })
                    .y(function(d, i) {return y(d)}),
                tip = d3.tip().attr('class', 'd3-tip').html(function(d) { 
                    return d; 
                });

            chart = d3.select(selection).append("svg")
                .attr("width", width).attr("height", height);

            var axis = chart.append("g")
                .attr("class", "yAxis")
                .attr("transform", "translate(" + (width - padding) + "," + padding / 2 + ")")
                .call(yAxis);

            var line = chart.append("g")
                .attr("class", "line")
                .attr("transform", "translate(" + padding + "," + padding / 2 + ")")
                .selectAll("path")
                .data(data).enter().append("path")
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", "#666");

            var circles = chart.append("g")
                .attr("class", "circles")
                .attr("transform", "translate(" + padding + "," + padding / 2 + ")")
                .selectAll("circle.dot")
                .data(_.flatten(data)).enter().append("circle")
                .attr("class", "dot")
                .attr("cx", function(d, i) {return x(i % 4 + 1)})
                .attr("cy", function(d) {return y(d)})
                .attr("r", 2.5)
                .call(tip)
                .on("mouseover", tip.show)
                .on("mouseleave", tip.hide);

            var hoverCircles = chart.append("g")
                .attr("class", "hoverCircles")
                .attr("transform", "translate(" + padding + "," + padding / 2 + ")")
                .selectAll("circle.dotHover")
                .data(_.flatten(data)).enter().append("circle")
                .attr("class", "dotHover")
                .attr("cx", function(d, i) {return x(i % 4 + 1)})
                .attr("cy", function(d) {return y(d)})
                .attr("r", 5)
                .call(tip)
                .on("mouseover", tip.show)
                .on("mouseleave", tip.hide);

        }

        lineChart.data = function(value) {
            if (!arguments.length) return data;
            data = value;
            return lineChart;
        }

        return lineChart;
    }
});