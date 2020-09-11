"use strict";
//TODO This code had to moved to DashboardDataService.  Jury still out if that this is a good or bad pattern.  Bottom line still need to figure out how to load a JS dependant's JS file
myClearwater.dataService = (function() {
        var getVehicles = function getVehiclesData() { return $.getScript("api/Vehicles") }
        var getLocations = function getLocationsData() { return $.get("api/Locations") }
        var getOperators = function getOperatorsData() { return $.get("api/Operators") }
        var getRadios = function getRadiosData() { return $.get("api/Radios"); }

        return {
            getVehicles: getVehicles,
            getLocations: getLocations,
            getOperators: getOperators,
            getRadios: getRadios
        };
    }
)();

$.getScript('/path/to/imported/script.js', function () {
    // script is now loaded and executed.
    // put your dependent JS here.
});