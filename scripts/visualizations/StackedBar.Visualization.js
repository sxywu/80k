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
            width = 500,
            barWidth = 13,
            height = 350,
            barPadding = 0,
            padding = 50;

        

        function stackedBar(selection) {     

            var scale = d3.scale.linear()
                .domain([0, max])
                .range([0, height]);

            var rectTip = d3.tip().attr('class', 'd3-tip')
                .direction("e").offset([0, barWidth / 2])
                .html(function(d, i) {
                    return _.template(RectangleHoverTemplate, d); 
                })


            // data = data[0].bars[0].bar;

            var groups = d3.select(selection).selectAll("g.bars")
                .data(data).enter().append("g").classed("bars", true)
                .attr("transform", function(d, i) {
                    return "translate(" + (i * (2 * barWidth + 4 * barPadding + padding)) + ", 0)";
                });

            var bars = groups.selectAll("g.bar").data(function(d) {return d.bars})
                .enter().append("g").classed("bar", true)
                .attr("transform", function(d, i) {return "translate(" + (i * (barWidth + 2 * barPadding)) + ", 0)"});

            var rects = bars.selectAll("rect").data(function(d) {return d;}).enter().append("rect")
                .attr("x", barPadding)
                .attr("y", function(d) {return height - scale(d.ending)})
                .attr("width", barWidth)
                .attr("height", function(d) {return scale(d.height)})
                .attr("opacity", function(d) {return d.opacity})
                .attr("fill", function(d) {return app.colors[d.party]})
                .attr("stroke", "none")
                .call(rectTip)
                .on("mouseover", rectTip.show)
                .on("mouseleave", rectTip.hide);

            var dots = groups.append("circle")
                .attr("cx", barPadding + barWidth)
                .attr("cy", function(d) {return height - scale(d.cost)})
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
                .attr("y1", function(d) {return height - scale(d.cost)})
                .attr("y2", function(d) {return height - scale(d.cost)})
                .attr("fill", "none")
                .attr("stroke", function(d) {
                    if (d.cost > d.bars[0][0].ending) {
                        return app.colors.red;
                    }
                    return app.colors.green;
                });

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