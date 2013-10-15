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
            this.collection.on("change", _.bind(this.renderOne, this));
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
            if (model.get("TYPE") === "Custom") {
                this.showEditable();
            } else if (model.get("TYPE").split("P")[0] === "2") {
                $(".secondIncome").show();
            } else if (model.get("TYPE").split("P")[0] === "1") {
                $(".secondIncome").hide();
                $(".secondIncomeToggle").prop("checked", false);
            }
            if (app.secondIncome) {
                $(".secondIncomeToggle").prop("checked", true);
            } else {
                $(".secondIncomeToggle").prop("checked", false);
            }
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
            if (val === "Custom") {
                this.$("#citySelect").val("Custom");
                this.showEditable();
                $(".secondIncome").show();
                $(".editButton[name='customizeCosts']").addClass("disabled");
            } else if (val.split("P")[0] === "2") {
                $(".secondIncome").show();
                $(".editButton[name='customizeCosts']").removeClass("disabled");
            } else if (val.split("P")[0] === "1") {
                $(".secondIncome").hide();
                $(".secondIncomeToggle").prop("checked", false);
                $(".editButton[name='customizeCosts']").removeClass("disabled");
            }
        },
        setCity: function(e) {
            var val = $(e.target).val();
            if (this.collection.showingCost.city === "Custom") {
                this.$("#householdSelect").val(this.collection.defaultCost.TYPE);
            }
            this.collection.setShowingCity(val);
            if (val === "Custom") {
                this.$("#householdSelect").val("Custom");
                this.showEditable();
                $(".editButton[name='customizeCosts']").addClass("disabled");
            } else {
                $(".editButton[name='customizeCosts']").removeClass("disabled");
            }
        },
        showEditable: function() {
            $(".costEdit").show();
            $(".costAmount").hide();
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