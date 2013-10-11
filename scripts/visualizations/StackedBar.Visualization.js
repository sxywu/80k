define([
    "jquery",
    "underscore",
    "d3",
    "d3.tip",
    "text!app/templates/RectangleHover.Template.html"
], function(
    $,
    _,
    d3,
    tip,
    RectangleHoverTemplate
) {
    return function() {
        var data,
            max = 150000,
            width = 525,
            barWidth = 13,
            height = 300,
            barPadding = 0,
            hoverHeight = 7,
            padding = {top: 25, left: 75};

        

        function stackedBar(selection) {     

            var x = d3.scale.linear()
                    .domain([2013, 2017])
                    .range([0, width - padding.left]),
                y = d3.scale.linear()
                    .domain([0, max])
                    .range([0, height - padding.top])
                yAxisScale = d3.scale.linear()
                    .domain([max, 0])
                    .range([0, height - padding.top]);

            var rectTip = d3.tip().attr('class', 'd3-tip')
                .direction("e").offset([0, barWidth / 2])
                .html(function(d, i) {
                    return _.template(RectangleHoverTemplate, d); 
                }),
                hoverTip = d3.tip().attr('class', 'd3-tip')
                .direction("e").offset([0, barWidth / 2])
                .html(function(d, i) {
                    return "cost of living<br> <div class='proposalAmount'>$" + d3.format(",f")(d.cost) + "</div>"; 
                });

            var svg = d3.select(selection);

            var groups = svg.selectAll("g.bars")
                .data(data).enter().append("g").classed("bars", true)
                .attr("transform", function(d, i) {
                    return "translate(" + (x(i + 2013) + padding.left) + ", 0)";
                });

            var bars = groups.selectAll("g.bar").data(function(d) {return d.bars})
                .enter().append("g").classed("bar", true)
                .attr("transform", function(d, i) {return "translate(" + (i * (barWidth + 2 * barPadding)) + ", 0)"});

            var rects = bars.selectAll("rect").data(function(d) {return d;}).enter().append("rect")
                .attr("x", barPadding)
                .attr("y", function(d) {return height - y(d.ending)})
                .attr("width", barWidth)
                .attr("height", function(d) {return y(d.height)})
                .attr("opacity", function(d) {return d.opacity})
                .attr("fill", function(d) {return app.colors[d.party]})
                .attr("stroke", "none")
                .call(rectTip)
                .on("mouseover", rectTip.show)
                .on("mouseleave", rectTip.hide);

            var dots = groups.append("circle")
                .attr("cx", barPadding + barWidth)
                .attr("cy", function(d) {return height - y(d.cost)})
                .attr("r", 3)
                .attr("fill", function(d) {
                    if (d.cost > d.bars[0][0].ending) {
                        return app.colors.red;
                    }
                    return app.colors.green;
                });

            var lines = groups.append("line")
                .attr("x1", 0)
                .attr("x2", 2 * barWidth)
                .attr("y1", function(d) {return height - y(d.cost)})
                .attr("y2", function(d) {return height - y(d.cost)})
                .attr("fill", "none")
                .attr("stroke", function(d) {
                    if (d.cost > d.bars[0][0].ending) {
                        return app.colors.red;
                    }
                    return app.colors.green;
                });

            var hover = groups.append("rect")
                .attr("x", barPadding)
                .attr("y", function(d) {return height - y(d.cost) - (hoverHeight / 2)})
                .attr("width", 2 * barWidth)
                .attr("height", hoverHeight)
                .attr("opacity", 0)
                .call(hoverTip)
                .on("mouseover", hoverTip.show)
                .on("mouseleave", hoverTip.hide);


            /*
            axis
            */
            var xAxis = d3.svg.axis()
                    .scale(x)
                    .ticks(5)
                    .tickFormat(d3.format("f"))
                    .orient("bottom"),
                yAxis = d3.svg.axis()
                    .scale(yAxisScale)
                    // .tickValues(tickValues)
                    // .tickFormat(d3.format("%"))
                    .orient("left");

            var xAxisG = svg.append("g")
                .attr("transform", "translate(" + (padding.left + barWidth) + ", " + height + ")")
                .classed("xAxis", true)
                .call(xAxis);
            var yAxisG = svg.append("g")
                .attr("transform", "translate(" + padding.left + ", " + padding.top + ")")
                .classed("yAxis", true)
                .call(yAxis);

            svg.append("text")
                .attr("x", padding.left - 10)
                .attr("y", padding.top)
                .classed("axisTitle", true)
                .attr("text-anchor", "end")
                .text("Annual ($)");

        }

        stackedBar.data = function(value) {
            if (!arguments.length) return data;
            data = value;
            return stackedBar;
        }

        stackedBar.max = function(value) {
            if (!arguments.length) return max;
            max = value;
            return stackedBar;
        }

        // events
        function mouseover(d) {
            console.log(d);
        }

        return stackedBar;
    }
});