define([
	"jquery",
	"underscore",
	"backbone"
], function(
	$,
	_,
	Backbone
) {
	var cities = {
		"SF": "San Francisco",
		"OF": "Oakland, Fremont",
		"SSS": "San Jose, Sunnyvale, Santa Clara",
		"VF": "Vallejo/Fairfield"
	},
	invertedCities = _.invert(cities);
	return Backbone.Router.extend({
		initialize: function(options) {
			this.chart = options.chart; // chartView
			this.chart.costs.on("change", _.bind(this.update, this));
			this.chart.proposals.on("change", _.bind(this.update, this));
			this.chart.positions.on("change", _.bind(this.update, this));
		},
		update: function() {
			var type = this.chart.costs.getShowingType(),
				city = invertedCities[this.chart.costs.getShowingCity()],
				month = this.chart.proposals.getMonth(),
				position = this.chart.positions.getPos(),
				array = [type, city, month, position],
				str = "";

			_.each(array, function(thing, i) {
				str += thing;
				if (i < array.length - 1) {
					str += "/";
				}
			});

			this.navigate(str, {replace: true});
		},
		routes: {
			":type/:city/:month/:position": "defaultRoute"
		},
		defaultRoute: function(type, city, month, position) {
			var that = this;
			this.chart.on("rendered", function() {
				$("#householdSelect").val(type);
				$("#citySelect").val(cities[city]);
				$("#monthSelect").val(month);
				that.chart.costs.setShowingCity(cities[city], {silent: true});
				that.chart.costs.setShowingType(type, {silent: true});
				that.chart.proposals.setMonth(month, {silent: true});
				that.chart.positions.setPosition(position, {silent: true});
			});
		}
	});
});