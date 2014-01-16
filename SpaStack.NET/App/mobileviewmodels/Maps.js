define([], function(){
    var basicOptions = {
        location: "40.749825, -73.987963",
        width: "100%",
        height: "100%",
        zoom: 13,
        markers: [
          { label: "A", location: [40.737102, -73.990318] },
          { label: "B", location: [40.749825, -73.987963] },
          { label: "С", location: [40.755823, -73.986397] }
        ],
        routes: [{
            weight: 5,
            color: "blue",
            locations: [
              [40.737102, -73.990318],
              [40.749825, -73.987963],
              [40.755823, -73.986397]
            ]
        }]
    };

    var viewModel = {
        tabs: [
            { text: "Google map" },
            { text: "Bing map" }
        ],
        selectedTab: ko.observable(0),
        mapBing: $.extend({}, basicOptions, {
            provider: "bing",
            mapType: "roadmap"
        }),
        mapGoogle: $.extend({}, basicOptions, {
            provider: "google",
            mapType: "satellite"
        })
    };

    return viewModel;
});
  