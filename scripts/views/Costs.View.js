define([
    "jquery",
    "underscore",
    "backbone",
    "text!app/templates/Cost.Template.html"
], function(
    $,
    _,
    Backbone,
    CostTemplate
) {
    return Backbone.View.extend({
        el: "#costsContainer",
        initialize: function() {
            this.collection = this.options.collection;

            this.collection.on("reset", _.bind(this.renderOne, this));
        },
        render: function() {
            this.collection.fetch();

            return this;
        },
        renderOne: function() {
            var model = this.collection.getCost()
            this.$("#costContainer").html(_.template(CostTemplate, {
                data: model.getExpenses(),
                monthly: model.monthlyTotal(),
                annual: model.total()
            }));
        },
        events: {
            "change #householdSelect": "setType",
            "change #citySelect": "setCity",
            "focusout .costEdit": "editCost",
            "keydown .costEdit": "keydown"
        },
        setType: function(e) {
            var val = $(e.target).val();
            if (this.collection.showingCost.TYPE === "Custom") {
                this.$("#citySelect").val(this.collection.defaultCost.city);
            }
            this.collection.setShowingType(val);
            this.renderOne();
            if (val === "Custom") {
                this.$("#citySelect").val("Custom");
                this.showEditable();
            }
        },
        setCity: function(e) {
            var val = $(e.target).val();
            if (this.collection.showingCost.city === "Custom") {
                this.$("#householdSelect").val(this.collection.defaultCost.TYPE);
            }
            this.collection.setShowingCity(val);
            this.renderOne();
            if (val === "Custom") {
                this.$("#householdSelect").val("Custom");
                this.showEditable();
            }
        },
        showEditable: function() {
            
            $(".costEdit").show();
            $(".costAmount").hide();
            console.log(this.$(".costEdit").css("display"));
        },
        hideEditable: function() {
            $(".costAmount").show();
            $(".costEdit").hide();
        },
        keydown: function(e) {
            var keyCode = e.keyCode,
                ENTER_KEY = 13;
            if (keyCode === ENTER_KEY) {
                this.editCost(e);
            }
        },
        editCost: function(e) {
            var key = $(e.target).attr("name"),
                val = $(e.target).val().replace("$", "").replace(",", ""),
                model = this.collection.getCost();

            if (!_.isNaN(parseInt(val))) {
                model.set(key, val);
                this.renderOne();
                this.showEditable();
            }
        }
    });
});