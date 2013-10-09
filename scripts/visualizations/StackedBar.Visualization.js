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
        var bar, data,
            max,
            width = 10,
            maxHeight = 350,
            padding = 5;

        

        function stackedBar(selection) {
            
            var scale = d3.scale.linear()
                .domain([0, max])
                .range([0, maxHeight]);

            bar = d3.select(selection).append("g") 
                .datum(data)
                .attr("transform", function(d) {return "translate(" + (d.transform * (width + 2 * padding)) + ", 0)"});

            bar.selectAll("rect")
                .data(data.bars).enter().append("rect")
                .attr("x", padding)
                .attr("y", function(d) {return maxHeight - scale(d.ending)})
                .attr("width", width)
                .attr("height", function(d) {return scale(d.ending) - scale(d.starting)})
                .attr("opacity", function(d) {return d.opacity})
                .attr("stroke", "none")
                .attr("fill", "#666")
                .on("mouseover", mouseover);
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