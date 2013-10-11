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
            max = 175000,
            width = 525,
            legendWidth = 225,
            barWidth = 13,
            height = 300,
            barPadding = 0,
            hoverHeight = 7,
            padding = {top: 25, left: 75},
            groups, bars, rects, dots, lines, hover, x, y;

        

        function stackedBar(selection) {     

            x = d3.scale.linear()
                    .domain([2013, 2017])
                    .range([0, width - padding.left]);
            y = d3.scale.linear()
                    .domain([0, max])
                    .range([0, height - padding.top]);
            var yAxisScale = d3.scale.linear()
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

            groups = svg.selectAll("g.bars")
                .data(data).enter().append("g").classed("bars", true)
                .attr("transform", function(d, i) {
                    return "translate(" + (x(i + 2013) + padding.left) + ", 0)";
                });

            bars = groups.selectAll("g.bar").data(function(d) {return d.bars})
                .enter().append("g").classed("bar", true)
                .attr("transform", function(d, i) {return "translate(" + (i * (barWidth + 2 * barPadding)) + ", 0)"});

            rects = bars.selectAll("rect").data(function(d) {return d;}).enter().append("rect")
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

            dots = groups.append("circle")
                .classed("dot", true)
                .attr("cx", barPadding + barWidth)
                .attr("cy", function(d) {return height - y(d.cost)})
                .attr("r", 3)
                .attr("fill", function(d) {
                    if (d.cost > d.bars[0][0].ending) {
                        return app.colors.red;
                    }
                    return app.colors.green;
                });

            lines = groups.append("line")
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

            hover = groups.append("rect")
                .classed("hover", true)
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

        stackedBar.legend = function(selection) {
            var svg = d3.select(selection);
            var costLegend = svg.append("g")
                .attr("transform", "translate(0, " + padding.top + ")");
            costLegend.append("circle")
                .attr("cx", barPadding + barWidth)
                .attr("cy", 0)
                .attr("r", 3)
                .attr("fill", app.colors.red);
            costLegend.append("line")
                .attr("x1", 0)
                .attr("x2", 2 * barWidth + barPadding)
                .attr("y0", 0)
                .attr("y1", 0)
                .attr("fill", "none")
                .attr("stroke", app.colors.red);
            costLegend.append("text")
                .attr("x", 2 * barWidth + barPadding + padding.top)
                .attr("y", 0)
                .attr("dy", ".25em")
                .text("Cost of living (Annual)");

            var barLegend = svg.selectAll("g.barLegend").data(data[0].bars)
                .enter().append("g").classed("barLegend", true)
                .attr("transform", function(d, i) {
                    return "translate(0, " + (2 * padding.top + i * barWidth) + ")";
                });
            barLegend.selectAll("rect").data(function(d) {return d})
                .enter().append("rect")
                .attr("x", function(d, i) {return i * (legendWidth / 4)})
                .attr("y", 0)
                .attr("width", legendWidth / 4)
                .attr("height", barWidth)
                .attr("opacity", function(d) {return d.opacity})
                .attr("fill", function(d) {return app.colors[d.party]});
            svg.selectAll("text.barText").data(data[0].bars[0])
                .enter().append("text").classed("barText", true)
                .attr("x", function(d, i) {return i * (legendWidth / 4)})
                .attr("y", 2 * padding.top + 3 * barWidth)
                .attr("text-anchor", "start")
                .text(function(d) {return d.title});

        }

        stackedBar.update = function() {
            groups.data(data);
            bars.data(function(d) {return d.bars});
            rects.data(function(d) {return d}).transition().duration(750)
                .attr("y", function(d) {return height - y(d.ending)})
                .attr("height", function(d) {return y(d.height)});
            dots.each(function(d, i) {
                d = data[i];
                d3.select(this).datum(d).transition().duration(750)
                    .attr("cy", function(d) {return height - y(d.cost)})
                    .attr("fill", function(d) {
                        if (d.cost > d.bars[0][0].ending) {
                            return app.colors.red;
                        }
                        return app.colors.green;
                    });
            });
            lines.each(function(d, i) {
                d = data[i];
                d3.select(this).datum(d).transition().duration(750)
                    .attr("y1", function(d) {return height - y(d.cost)})
                    .attr("y2", function(d) {return height - y(d.cost)})
                    .attr("stroke", function(d) {
                        if (d.cost > d.bars[0][0].ending) {
                            return app.colors.red;
                        }
                        return app.colors.green;
                    });
            });
            hover.each(function(d, i) {
                d = data[i];
                d3.select(this).datum(d).transition().duration(750)
                    .attr("y", function(d) {return height - y(d.cost) - (hoverHeight / 2)});
            });
        }

        /* getter/setters */
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

        return stackedBar;
    }
});