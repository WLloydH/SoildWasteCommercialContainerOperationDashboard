

myClearwater.vehicles = function () {
    "use strict";
    try {
        var activeVehicleEditor = new $.fn.dataTable.Editor({

            ajax: 'api/Vehicles',
            table: '#activeVehicles',
            fields: [
                {
                    label: 'Vehicle:',
                    name: 'VehicleNbr'
                },
                {
                    name: 'LoginName',
                    type: "hidden"
                },
                {
                    name: 'CreateDate',
                    type: "hidden"

                },
                {
                    name: 'ModifyDate',
                    type: "hidden"

                }
            ]
        });


        var activateVehiclesDT = $('#activeVehicles')
            .DataTable({
                dom: '<Bftpi>',
                ajax: 'api/Vehicles',
                columns: [
                    {
                        data: 'Vehicle',
                        render: function (data, type, row) {
                            return row.VehicleNbr;
                        },
                        class: "dtCenter"
                    },
                    {
                        data: 'LoginName',
                        render: function (data, type, row) {
                            return row.LoginName;
                        }
                    },
                    {
                        data: 'CreateDate',
                        render: function (data, type, row) {
                            return row.CreateDate;
                        }
                    },
                    {
                        data: 'ModifyDate',
                        render: function (data, type, row) {
                            return row.ModifyDate;
                        }
                    }

                ],
                columnDefs: [
                    { "targets": 1, "visible": false, "searchable": false },
                    { "targets": 2, "visible": false, "searchable": false },
                    { "targets": 3, "visible": false, "searchable": false },
                    { "targets": 3, "visible": false, "searchable": false }
                ],
                select: { style: 'single' },
                buttons: [
                    { extend: 'create', editor: activeVehicleEditor },
                    { extend: 'edit', editor: activeVehicleEditor },
                    { extend: 'remove', editor: activeVehicleEditor }
                ]
            });

        activeVehicleEditor.on('preSubmit', function validatePreSubmitData(e, d) {
            if (this.val('VehicleNbr') !== undefined) {
                if (this.val('VehicleNbr').trim().length > 5) {
                    this.error('VehicleNbr', 'Vehicle number is too long. Please limit length to 5');
                    return false;
                }
                var vehicleNbr = this.val('VehicleNbr');
                var result = $.grep(myClearwater.vehicleList,
                    function (e) {
                        return e.label == vehicleNbr;
                    });
                if (result.length > 0) {
                    this.error('VehicleNbr', 'Vehicle number already added');
                    return false;
                }
            }
            return true;
        });
        activeVehicleEditor.on('postSubmit', function (e, json, data, action, xhr) {
            if (json.error !== null) {
                clearInterval(interval);
                myClearwater.errorMsg(json.error);
                json.error = null;
            }
        });

        $('#activeVehicles').on('error.dt', function (e, settings, techNote, message) {
            clearInterval(interval);
            myClearwater.errorMsg(message);
        });

        $('#activeVehicles').on('xhr.dt', function (e, settings, json, xhr) {
            if (json) {
                if (json.error !== null) {
                    clearInterval(interval);
                    myClearwater.errorMsg(json.error);
                    json.error = null;
                }
            }
        });

        var interval = setInterval(function reloadVehicleData() { activateVehiclesDT.ajax.reload(null, false); }, 1000);
    }
    catch (e) {
        myClearwater.errorMsg(e);
    }
};