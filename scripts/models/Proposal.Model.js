define([
    "jquery",
    "underscore",
    "backbone"
], function(
    $,
    _,
    Backbone
) {
    /*

    */
    return Backbone.Model.extend({
        initialize: function() {
            this.convertToArray();
        },
        /* the csv i saved is formatted weird, so convert the arrays from string to arrays */
        convertToArray: function() {
            var attributes = this.attributes,
                keys = _.chain(this.attributes)
                    .keys().without("month").value();
            _.each(keys, function(key) {
                attributes[key] = $.parseJSON(attributes[key]);
            });
        },
        /* json for passing into LineChart visualization */
        getLineData: function() {
            var data = {},
                keys = _.chain(this.attributes)
                    .keys().without("month").value(),
                attributes = this.attributes;

            _.each(keys, function(key) {
                var keys = key.split(","),
                    type = keys[0],
                    party = keys[1],
                    val = attributes[key],
                    array = _.map(val, function(rate, i) {
                        var obj = {};
                        obj.party = party;
                        obj.year = i + 1;
                        obj.rate = (rate / 100).toFixed(3);

                        return obj;
                    });
                
                if (data[type]) {
                    data[type].push(array);
                } else {
                    data[type] = [array];
                }
            });

            console.log(data);
            return data;
        }
    });
});