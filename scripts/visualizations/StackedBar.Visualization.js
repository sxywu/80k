define([
    "jquery",
    "underscore",
    "d3"
], function(
    $,
    _,
    d3
) {
    return function() {
        var data,
            max = 150000,
            width = 500,
            barWidth = 10,
            height = 300,
            barPadding = 1,
            padding = 50;

        

        function stackedBar(selection) {     

            var scale = d3.scale.linear()
                .domain([0, max])
                .range([0, height]);


            // data = data[0].bars[0].bar;

            var groups = d3.select(selection).selectAll("g.bars")
                .data(data).enter().append("g").classed("bars", true)
                .attr("transform", function(d, i) {
                    return "translate(" + (i * (2 * barWidth + 4 * barPadding + padding)) + ", 0)";
                });

            var bars = groups.selectAll("g.bar").data(function(d) {return d.bars})
                .enter().append("g").classed("bar", true)
                .attr("transform", function(d, i) {return "translate(" + (i * (barWidth + 2 * barPadding)) + ", 0)"});

            var rects = bars.selectAll("rect").data(function(d) {return d}).enter().append("rect")
                .attr("x", padding)
                .attr("y", function(d) {return height - scale(d.ending)})
                .attr("width", barWidth)
                .attr("height", function(d) {return scale(d.ending) - scale(d.starting)})
                .attr("opacity", function(d) {return d.opacity})
                .attr("fill", function(d) {return app.colors[d.party]})
                .attr("stroke", "none");


            // var bar = d3.select(selection).append("g") 
            //     .datum(data);
            //     // .attr("transform", function(d) {return "translate(" + (d.transform * (width + 2 * padding)) + ", 0)"});

            // bar.selectAll("rect")
            //     .data(data).enter().append("rect")
            //     .attr("x", padding)
            //     .attr("y", function(d) {return height - scale(d.ending)})
            //     .attr("width", barWidth)
            //     .attr("height", function(d) {return scale(d.ending) - scale(d.starting)})
            //     .attr("opacity", function(d) {return d.opacity})
            //     .attr("stroke", "none")
            //     .attr("fill", "#666")
            //     .on("mouseover", mouseover);
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