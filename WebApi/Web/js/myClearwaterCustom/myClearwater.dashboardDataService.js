var myClearwater = myClearwater || {};
myClearwater.id = 0;
myClearwater.vehicleList = [];
myClearwater.operatorList = [];
myClearwater.radioList = [];
myClearwater.locationList = [];

myClearwater.dataService = (function gettData() {
    var getVehicles = function getVehiclesData() { return $.get("api/Vehicles"); };
    var getLocations = function getLocationsData() { return $.get("api/Locations"); };
    var getOperators = function getOperatorsData() { return $.get("api/Operators"); };
    var getRadios = function getRadiosData() { return $.get("api/Radios"); };

    return {
        getVehicles: getVehicles,
        getLocations: getLocations,
        getOperators: getOperators,
        getRadios: getRadios
    };
}
 )();

myClearwater.getCurrentMasterLists = function getCurrentMasterLists(activateCallBack) {
    try {

        var promise;

        promise = $.when(myClearwater.dataService.getVehicles(),
            myClearwater.dataService.getOperators(),
            myClearwater.dataService.getRadios(),
            myClearwater.dataService.getLocations());

        promise.done(function (vehicles, operators, radios, locations) {

            try {
                myClearwater.vehicleList = [];
                myClearwater.operatorList = [];
                myClearwater.radioList = [];
                myClearwater.locationList = [];

                (function getVehiclesList() {
                    let vehicle;
                    for (let i = 0; i < vehicles[0].data.length; i++) {
                        vehicle = vehicles[0].data[i];
                        myClearwater.vehicleList.push({ label: vehicle.VehicleNbr, value: vehicle.PK });
                    }
                })();

                (function getLocationsList() {
                    let location;
                    for (let i = 0; i < locations[0].data.length; i++) {
                        location = locations[0].data[i];
                        myClearwater.locationList.push({ label: location.LocationName, value: location.PK });
                    }
                })();

                (function getOperatorsList() {
                    let operator;
                    for (let i = 0; i < operators[0].data.length; i++) {
                        operator = operators[0].data[i];
                        myClearwater.operatorList.push({
                            label: operator.OperatorName,
                            value: operator.PK,
                            assignedVehicle: operator.FK_Vehicle,
                            assignedRadio: operator.FK_Radio
                        });
                    }
                })();

                (function getRadioList() {
                    let radio;
                    for (let i = 0; i < radios[0].data.length; i++) {
                        radio = radios[0].data[i];
                        myClearwater.radioList.push({ label: radio.CallSign, value: radio.PK });
                    }
                })();

                if (typeof activateCallBack === "function") {
                    activateCallBack();
                }


            } catch (e) {
                alert("Sorry we are have a problem setting up data. Please contact helpdesk ".concat(e));
            }

        });

        promise.fail();  //TODO why is the fail  event trigger alert("Sorry we are have a problem setting up data. Please contact helpdesk "));
    }
    catch (e) {
        myClearwater.errorMsg(e);
    }

};
