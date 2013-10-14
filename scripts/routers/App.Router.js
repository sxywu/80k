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
		"VF": "Vallejo/Fairfield",
		"Custom": "Custom"
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
			if (app.dragging) return;
			var type = this.chart.costs.getShowingType(),
				city = invertedCities[this.chart.costs.getShowingCity()],
				month = this.chart.proposals.getMonth(),
				position = this.chart.positions.getPos(),
				kv = {type: type, city: city, month: month, position: position},
				length = _.keys(kv).length,
				str = "",
				i = 0,
				kind = "default/",
				that = this;

			_.each(kv, function(val, key) {
				if (val === "Custom") {
					if (kind !== "default/") {
						kind = "custom/all/";
						str += that.chart.proposals.getCustomURL();
					} else if (key === "city") {
						kind = "custom/costs/";
						str += that.chart.costs.getCustomURL();
					} else if (key === "month") {
						kind = "custom/proposals/"
						str += that.chart.proposals.getCustomURL();
					}
				} else {
					str += val;	
				}
				if (i < length - 1) {
					str += (key === "type" && val === "Custom" ? "" : "/");
				}

				i += 1;
			});

			console.log(str);
			str += "/" + (app.secondIncome ? 1 : 0);

			$(".URLtoShare").val("http://sxywu.github.io/80k/#" + kind + str);
			this.navigate(kind + str, {replace: true});
		},
		routes: {
			"default/:type/:city/:month/:position/:spouse": "routeDefault",
			"custom/proposals/:type/:city/:proposal/:position/:spouse": "customProposal",
			"custom/costs/:costs/:month/:position/:spouse": "customCosts",
			"custom/all/:costs/:proposal/:position/:spouse": "customAll"
		},
		routeDefault: function(type, city, month, position, spouse) {
			var that = this;
			this.chart.on("rendered", function() {
				app.secondIncome = (spouse === "0" ? false : true);
				$("#householdSelect").val(type);
				$("#citySelect").val(cities[city]);
				$("#monthSelect").val(month);
				that.chart.costs.setShowingCity(cities[city]);
				that.chart.costs.setShowingType(type);
				that.chart.proposals.setMonth(month);
				that.chart.positions.setPosition(position);
			});
		},
		customProposal: function(type, city, proposal, position, spouse) {
			var that = this;
			this.chart.on("rendered", function() {
				app.secondIncome = (spouse === "0" ? false : true);
				$("#householdSelect").val(type);
				$("#citySelect").val(cities[city]);
				$("#monthSelect").val("Custom");
				that.chart.costs.setShowingCity(cities[city]);
				that.chart.costs.setShowingType(type);
				that.chart.positions.setPosition(position);

				that.chart.proposals.setMonth("Custom", {silent: true});
				that.chart.proposals.setCustomURL(proposal);

			});
		},
		customCosts: function(costs, month, position, spouse) {
			var that = this;
			this.chart.on("rendered", function() {
				app.secondIncome = (spouse === "0" ? false : true);
				$("#householdSelect").val("Custom");
				$("#citySelect").val("Custom");
				$("#monthSelect").val(month);
				that.chart.positions.setPosition(position);
				that.chart.proposals.setMonth(month);

				that.chart.costs.setShowingCity("Custom", {silent: true});
				that.chart.costs.setCustomURL(costs);
			});
		},
		customAll: function(costs, proposal, position, spouse) {
			var that = this;
			this.chart.on("rendered", function() {
				app.secondIncome = (spouse === "0" ? false : true);
				$("#householdSelect").val("Custom");
				$("#citySelect").val("Custom");
				$("#monthSelect").val("Custom");
				that.chart.positions.setPosition(position);

				that.chart.proposals.setMonth("Custom", {silent: true});
				that.chart.proposals.setCustomURL(proposal);
				that.chart.costs.setShowingCity("Custom", {silent: true});
				that.chart.costs.setCustomURL(costs);
			});
		}
	});
});