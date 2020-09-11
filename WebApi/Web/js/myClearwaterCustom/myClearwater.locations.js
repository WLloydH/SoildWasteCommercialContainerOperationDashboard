
myClearwater.locations = function () {
    "use strict";
    try {
        var activeLocationEditor = new $.fn.dataTable.Editor({
            ajax: 'api/Locations',
            table: '#activeLocations',
            fields: [
                {
                    label: 'Location:',
                    name: 'LocationName'
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
            ],
            columnDefs: [
                { "targets": 1, "visible": false, "searchable": false },
                { "targets": 2, "visible": false, "searchable": false },
                { "targets": 3, "visible": false, "searchable": false },
                { "targets": 3, "visible": false, "searchable": false }
            ]
        });


        var activeLocationsDT = $('#activeLocations')
            .DataTable({
                dom: '<Bftpi>',
                ajax: 'api/Locations',
                columns: [
                    {
                        data: 'Location',
                        render: function (data, type, row) {
                            return row.LocationName;
                        },
                        class: "dtCenter"
                    },
                    {
                        data: 'Login Name',
                        render: function (data, type, row) {
                            return row.LoginName;
                        }
                    },
                    {
                        data: 'Create Date',
                        render: function (data, type, row) {
                            return row.CreateDate;
                        }
                    },
                    {
                        data: 'Modify Date',
                        render: function (data, type, row) {
                            return row.ModifyDate;
                        }
                    }

                ],
                columnDefs: [
                    { "targets": 1, "visible": false, "searchable": false },
                    { "targets": 2, "visible": false, "searchable": false },
                    { "targets": 3, "visible": false, "searchable": false }
                ],
                select: { style: 'single' },
                buttons: [
                    { extend: 'create', editor: activeLocationEditor },
                    { extend: 'edit', editor: activeLocationEditor },
                    { extend: 'remove', editor: activeLocationEditor }
                ]
            });

        activeLocationEditor.on('preSubmit',
            function validatePreSubmitData(e, d) {
                if (this.val('LocationName') !== undefined) {
                    if (this.val('LocationName').trim().length > 50) {
                        this.error('LocationName', 'Location is too long. Please limit length to 50');
                        return false;
                    }
                }
                return true;
            });

        activeLocationEditor.on('postSubmit', function (e, json, data, action, xhr) {
            if (json.error !== null) {
                clearInterval(interval);
                myClearwater.errorMsg(json.error);
                json.error = null;
            }
        });

        $('#activeLocations').on('error.dt', function (e, settings, techNote, message) {
            clearInterval(interval);
            myClearwater.errorMsg(message);
        });

        $('#activeLocations').on('xhr.dt', function (e, settings, json, xhr) {
            if (json) {
                if (json.error !== null) {
                    clearInterval(interval);
                    myClearwater.errorMsg(json.error);
                    json.error = null;
                }
            }
        });

        var interval = setInterval(function reloadLocationsData() { activeLocationsDT.ajax.reload(); }, 600000);

    }
    catch (e) {

        myClearwater.errormsg(e);
    }

};

