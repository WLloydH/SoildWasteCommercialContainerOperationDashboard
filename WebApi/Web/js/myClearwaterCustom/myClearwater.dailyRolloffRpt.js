"use strict";

myClearwater.rollOffRpt = function rollOffRpt() {

    try {
        var rolloffRpt = $('#rolloffRpt').DataTable({
            dom: 'Bfiptlip',
            ajax: "api/DailyRolloff",
            columns: [

                {
                    data: 'Route Date',
                    type: 'datetime',
                    render: function (data, type, row) {
                        return moment(row.RouteDate).format("MMM DD YYYY");
                    }
                },
                {
                    data: 'Dump Returns',
                    render: function (data, type, row) {
                        return row.DumpAndReturns;
                    },
                    className: 'dt-body-right'
                },
                {
                    data: 'Dump Removes',
                    render: function (data, type, row) {
                        return row.DumpAndRemoves;
                    },
                    className: 'dt-body-right'
                },
                {
                    data: 'Dump Relocates',
                    render: function (data, type, row) {
                        return row.DumpAndRelocates;
                    },
                    className: 'dt-body-right'
                },
                {
                    data: 'Deliveries',
                    className: 'dt-body-right'
                },
                {
                    data: 'In-Kind',
                    className: 'dt-body-right'
                },
                {
                    data: 'Trucks',
                    className: 'dt-body-right'
                }
            ],
            buttons: [{ extend: 'print', text: 'Print All', id: 'printAll' }]
        });

        $('#rolloffRpt').on('error.dt', function (e, settings, techNote, message) {
            clearInterval(interval);
            myClearwater.errorMsg(message);
        });

        $('#rolloffRpt').on('xhr.dt', function (e, settings, json, xhr) {
            if (json) {
                if (json.error !== null) {
                    clearInterval(interval);
                    myClearwater.errorMsg(json.error);
                    json.error = null;
                }
            }
        });

        var interval = setInterval(function reloadRolloffRptData() { rolloffRpt.ajax.reload(null, false); }, 5000);
    }
    catch (e) {
        myClearwater.errorMsg(e);
    }
};
