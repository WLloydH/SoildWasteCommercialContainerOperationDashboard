

myClearwater.activeWork = function activeWork() {
    "use strict";

    try {

        var clearActiveDT = $('#activeWork')
            .DataTable({
                dom: 'Bfpti',
                ajax: {
                    url: 'api/ActiveRoutes'
                },
                columns: [
                    {
                        data: 'Operator',
                        render: function (data, type, row) {
                            return row.OperatorName;
                        }
                    },
                    {
                        data: 'Vehicle',
                        render: function (data, type, row) {
                            return row.VehicleNbr;
                        }
                    },
                    {
                        data: 'Call Sign',
                        render: function (data, type, row) {
                            return row.CallSign;
                        }
                    },
                    {
                        data: 'Route Date',
                        type: 'datetime',
                        render: function (data, type, row) {
                            return moment(row.RouteDate).format("MMM DD YYYY");

                        }
                    },
                    {
                        data: 'Stops',
                        render: function (data, type, row) {
                            return row.Stops;
                        }
                    }
                ],



                buttons: [
                    {
                        text: "Clear Active Days Work",
                        action: function () {
                            $.post("api/ActiveRoutes").done(
                                function redrawAfterClear() {
                                    clearActiveDT.ajax.reload();
                                });
                            toastr["info"]("Active Days Work Cleared");
                        }
                    },
                    {
                        text: "Undo Clear Active Days Work",
                        action: function () {
                            $.post("api/undoClearActiveRoutes").done(
                                function redrawAfterUndo() {
                                    clearActiveDT.ajax.reload();
                                });
                            toastr["info"]("Active Days Work Restored");
                        }
                    }
                ]
            });



        $('#activeWork').on('error.dt', function (e, settings, techNote, message) {
            clearInterval(interval);
            myClearwater.errorMsg(message);
        });

        $('#activeWork').on('xhr.dt', function (e, settings, json, xhr) {
            if (json) {
                if (json.error !== null) {
                    clearInterval(interval);
                    myClearwater.errorMsg(json.error);
                    json.error = null;
                }
            }
        });

        var interval = setInterval(function reloadManagerData() {
            myClearwater.getCurrentMasterLists();
            clearActiveDT.ajax.reload();
        }, 2500);
    }
    catch (e) {
        myClearwater.errorMsg(e);
    }

};



