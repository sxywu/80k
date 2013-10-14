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
            legendWidth = 250,
            barWidth = 13,
            height = 300,
            barPadding = .5,
            hoverHeight = 7,
            padding = {top: 25, left: 75},
            groups, bars, rects, dots, lines, hover, x, y, 
            barLegend, rectTip, hoverTip, svg, legendSVG,
            hoverLine, hoverLineTip;

        

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

            rectTip = d3.tip().attr('class', 'd3-tip')
                .direction("e").offset([0, barWidth / 2])
                .html(function(d, i) {
                    return _.template(RectangleHoverTemplate, d); 
                });
            hoverTip = d3.tip().attr('class', 'd3-tip')
                .direction("e").offset([0, barWidth / 2])
                .html(function(d, i) {
                    return "cost of living<br> <div class='proposalAmount'>$" + d3.format(",f")(d.cost) + "</div>"; 
                });
            hoverLineTip = d3.tip().attr('class', 'd3-tip')
                .direction("w").offset([0, - barWidth / 2])
                .html(function(d) {
                    return "$" + d3.format(",f")(d.ending);
                });

            svg = d3.select(selection);

            groups = svg.selectAll("g.bars")
                .data(data).enter().append("g").classed("bars", true)
                .attr("transform", function(d, i) {
                    return "translate(" + (x(i + 2013) + padding.left) + ", 0)";
                });

            bars = groups.selectAll("g.bar").data(function(d) {return d.bars})
                .enter().append("g").classed("bar", true)
                .attr("transform", function(d, i) {return "translate(" + (i * (barWidth + 2 * barPadding)) + ", 0)"});

            rects = bars.selectAll("rect").data(function(d) {return d;}).enter().append("rect")
                .attr("class", function(d) {return d.title + "Bar"})
                .attr("x", barPadding)
                .attr("y", function(d) {return height - y(d.ending)})
                .attr("width", barWidth)
                .attr("height", function(d) {return y(d.height)})
                .attr("opacity", function(d) {return d.opacity})
                .attr("fill", function(d) {return app.colors[d.party]})
                .attr("stroke", "none")
                .call(rectTip)
                .on("mouseover", mouseover)
                .on("mouseleave", mouseleave);

            dots = groups.append("circle")
                .classed("dot", true)
                .attr("cx", barPadding + barWidth)
                .attr("cy", function(d) {return height - y(d.cost)})
                .attr("r", 3)
                .attr("fill", function(d) {
                    var BARTbase = (app.secondIncome ? d.bars[0][1].height + app.medianIncome : d.bars[0][0].height),
                        UnionBase = (app.secondIncome ? d.bars[1][1].height + app.medianIncome : d.bars[1][0].height);
                    if (d.cost > BARTbase
                        || d.cost > UnionBase) {
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
                    var BARTbase = (app.secondIncome ? d.bars[0][1].height + app.medianIncome : d.bars[0][0].height),
                        UnionBase = (app.secondIncome ? d.bars[1][1].height + app.medianIncome : d.bars[1][0].height);
                    if (d.cost > BARTbase
                        || d.cost > UnionBase) {
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
            legendSVG = d3.select(selection);
            var costLegend = legendSVG.append("g")
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

            barLegend = legendSVG.selectAll("g.barLegend").data(data[0].bars)
                .enter().append("g").classed("barLegend", true)
                .attr("transform", function(d, i) {
                    return "translate(0, " + (2 * padding.top + i * barWidth + i * barPadding) + ")";
                });
            barLegend.selectAll("rect").data(function(d) {return d})
                .enter().append("rect").attr("class", function(d) {return d.title + "Bar"})
                .attr("x", function(d, i) {return i * (legendWidth / 4)})
                .attr("y", 0)
                .attr("width", legendWidth / 4)
                .attr("height", barWidth)
                .attr("opacity", function(d) {return d.opacity})
                .attr("fill", function(d) {return app.colors[d.party]});

            var legendHover = legendSVG.append("g").classed("legendHover", true)
                .attr("transform", "translate(0," + 2 * padding.top + ")")
                .on("mouseleave", function() {
                    stackedBar.update(0);
                });

            legendHover.selectAll("rect.hover").data(data[0].bars[0]).enter()
                .append("rect").attr("class", "hover")
                .attr("x", function(d, i) {return i * (legendWidth / 4)})
                .attr("y", 0)
                .attr("width", legendWidth / 4)
                .attr("height", barWidth * 2)
                .attr("opacity", 0)
                .style("cursor", "pointer")
                .on("mouseover", legendMouseover);

            legendSVG.selectAll("text.barText").data(data[0].bars[0])
                .enter().append("text").classed("barText", true)
                .attr("x", function(d, i) {return i * (legendWidth / 4)})
                .attr("y", 2 * padding.top + 3 * barWidth)
                .attr("text-anchor", "start")
                .text(function(d) {return d.title});

        }

        stackedBar.update = function(duration) {
            duration = (duration !== undefined ? duration : 750);
            groups.data(data);
            bars.data(function(d) {return d.bars});
            rects.data(function(d) {return d}).transition().duration(duration)
                .attr("y", function(d) {return height - y(d.ending)})
                .attr("height", function(d) {return y(d.height)})
                .attr("opacity", function(d) {return d.opacity})
                .attr("fill", function(d) {return app.colors[d.party]})
                .attr("opacity", function(d) {return d.opacity});
            bars.selectAll("rect").data(function(d) {return d})
                .enter().append("rect").transition().duration(duration)
                .attr("class", function(d) {return d.title + "Bar"})
                .attr("x", barPadding)
                .attr("y", function(d) {return height - y(d.ending)})
                .attr("width", barWidth)
                .attr("height", function(d) {return y(d.height)})
                .attr("opacity", function(d) {return d.opacity})
                .attr("fill", function(d) {return app.colors[d.party]})
                .attr("stroke", "none");
            bars.selectAll("rect").data(function(d) {return d;})
                .exit().remove();
            rects = bars.selectAll("rect")
                .call(rectTip)
                .on("mouseover", mouseover)
                .on("mouseleave", mouseleave);

            barLegend.data(function(d) {return data[0].bars;});
            barLegend.selectAll("rect").data(function(d) {return d;})
                .transition().duration(duration)
                .attr("fill", function(d) {return app.colors[d.party]})
                .attr("opacity", function(d) {return d.opacity});
            barLegend.selectAll("rect").data(function(d) {return d;})
                .enter().append("rect").attr("class", function(d) {return d.title + "Bar"})
                .attr("x", function(d, i) {return i * (legendWidth / 4)})
                .attr("y", 0)
                .attr("width", legendWidth / 4)
                .attr("height", barWidth)
                .attr("opacity", function(d) {return d.opacity})
                .attr("fill", function(d) {return app.colors[d.party]});
            barLegend.selectAll("rect").data(function(d) {return d;})
                .exit().remove();

            legendSVG.selectAll("text.barText").data(data[0].bars[0])
                .text(function(d) {return d.title});
            legendSVG.selectAll("text.barText").data(data[0].bars[0])
                .enter().append("text").classed("barText", true)
                .attr("x", function(d, i) {return i * (legendWidth / 4)})
                .attr("y", 2 * padding.top + 3 * barWidth)
                .attr("text-anchor", "start")
                .text(function(d) {return d.title});
            legendSVG.selectAll("text.barText").data(data[0].bars[0])
                .exit().remove();

            dots.each(function(d, i) {
                d = data[i];
                d3.select(this).datum(d).transition().duration(duration)
                    .attr("cy", function(d) {return height - y(d.cost)})
                    .attr("fill", function(d) {                    
                        var BARTbase = (app.secondIncome ? d.bars[0][1].height + app.medianIncome : d.bars[0][0].height),
                            UnionBase = (app.secondIncome ? d.bars[1][1].height + app.medianIncome : d.bars[1][0].height);
                        if (d.cost > BARTbase
                            || d.cost > UnionBase) {
                            return app.colors.red;
                        }
                        return app.colors.green;
                    });
            });
            lines.each(function(d, i) {
                d = data[i];
                d3.select(this).datum(d).transition().duration(duration)
                    .attr("y1", function(d) {return height - y(d.cost)})
                    .attr("y2", function(d) {return height - y(d.cost)})
                    .attr("stroke", function(d) {
                        var BARTbase = (app.secondIncome ? (d.bars[0][1].height + app.medianIncome) : d.bars[0][0].height),
                            UnionBase = (app.secondIncome ? (d.bars[1][1].height + app.medianIncome) : d.bars[1][0].height);
                        if (d.cost > BARTbase
                            || d.cost > UnionBase) {
                            return app.colors.red;
                        }
                        return app.colors.green;
                    });
            });
            hover.each(function(d, i) {
                d = data[i];
                d3.select(this).datum(d).transition().duration(duration)
                    .attr("y", function(d) {return height - y(d.cost) - (hoverHeight / 2)});
            });
        }

        /* events */
        function legendMouseover(d) {
            rects.attr("opacity", 0.1);
            barLegend.selectAll("rect").attr("opacity", 0.1);
            barLegend.selectAll("." + d.title + "Bar").attr("opacity", 1);
            bars.selectAll("." + d.title + "Bar").attr("opacity", 1);
        }

        function mouseover(d) {
            rectTip.show(d);
            if (hoverLine) {
                hoverLine.transition().duration(250)
                    .attr("y1", height - y(d.ending))
                    .attr("y2", height - y(d.ending))
                    .each("end", function() {
                        app.hoverLineTarget = this;
                        hoverLineTip.show(d);
                        app.hoverLineTarget = false;
                    });
                
            } else {
                hoverLine = svg.append("line").classed("hoverLine", true)
                    .attr("x1", padding.left)
                    .attr("x2", width + 2 * barWidth + barPadding)
                    .attr("y1", height - y(d.ending))
                    .attr("y2", height - y(d.ending))
                    .attr("fill", "none")
                    .attr("stroke", "#666")
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray", "5,5")
                    .call(hoverLineTip);

                app.hoverLineTarget = hoverLine[0][0];
                hoverLineTip.show(d);
                app.hoverLineTarget = false;
            }
        }

        function mouseleave(d) {
            rectTip.hide(d);
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