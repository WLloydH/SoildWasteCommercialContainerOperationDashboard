

var myClearwater = myClearwater || {};
myClearwater.id = 0;

myClearwater.dashboard = function dashboard () {
    "use strict";
    try {
        var intervalSet = false;
        var dashboardTableIds = [];
        $('#routeDate').datepicker();
        $('#routeDate').datepicker('setDate', 'today');
        (function loadDashboard () {

            $.get('api/DashboardTableHeaders', { "RouteDate": moment($("#routeDate").datepicker("getDate")).format("MM-DD-YYYY") })
               .done(function loadHeader(data) {
                  dashboardTableIds = [];
                   for (let index = 0, len = data.data.length; index < len; index++) {
                       if (data.data.hasOwnProperty(index)) {
                           var vehicleNbr = data.data[index].VehicleNbr;
                           var vehicle_PK = data.data[index].Vehicle_PK.toString();

                           var operatorName = data.data[index].OperatorName;
                           var operator_PK = data.data[index].Operator_PK.toString();

                           var callSign = data.data[index].CallSign;
                           var radio_PK = data.data[index].Radio_PK.toString();

                           var dashboardTableId = operator_PK.concat(vehicle_PK).concat(radio_PK);

                           if ($('#'.concat(dashboardTableId)).length === 0) {

                               $('#SWOpDashboardtrHead')
                                   .append($('<th class="dtHeader"; style=" border-width: 1px; border-style: solid; border-color: green;>" '
                                       .concat('<br/>')
                                       .concat(operatorName)
                                       .concat('&nbsp;')
                                       .concat('<br/>')
                                       .concat(vehicleNbr)
                                       .concat('<br/>#')
                                       .concat(callSign)
                                       .concat('<br/>')));

                               $('#SWOpDashboardtrHead').css('border-top', 'solid');
                               $('#SWOpDashboardtrDT').append('<td  valign="top"; style ="width:200px;" class="dtTDContainer"><table id='.concat(dashboardTableId) + '/>');

                               $('#'.concat(dashboardTableId))
                                   .addClass('row-border cell-border display compact cellspacing="0" ');
                               var routeDataTable = $('#'.concat(dashboardTableId))
                                   .DataTable({
                                       dom: '<>',
                                       ordering: false,
                                       "paging": false,
                                       ajax: {
                                           url: 'api/DashboardAssignedRoutes',
                                           data: {
                                               'VehicleNbr': vehicleNbr,
                                               'OperatorName': operatorName,
                                               'CallSign': callSign,
                                               'RouteDate': moment($("#routeDate").datepicker("getDate")).format("MM-DD-YYYY")
                                           }
                                       },
                                       'createdRow': function (row, data, index) {
                                           setStatusColorClass(row, data, index);
                                       },
                                       columns: [
                                           {
                                               data: '',
                                               render: function (data, type, row) {
                                                   if (row.Note.length > 0) {
                                                       if (row.Status.trim() === '98' || row.Status.trim() === '22') {

                                                           return row.LocationName
                                                               .concat('</br>')
                                                               .concat(row.Note)
                                                               .concat('</br>')
                                                               .concat(row.Rolloff)
                                                               .concat(' *')
                                                               .concat(row.Status);
                                                       }
                                                       else {
                                                           return row.LocationName
                                                               .concat('</br>')
                                                               .concat(row.Note)
                                                               .concat('</br>')
                                                               .concat(row.Rolloff);
                                                       }
                                                   }
                                                   return row.LocationName;
                                               }
                                           }
                                       ]
                                   });

                               dashboardTableIds.push(routeDataTable);
                          }
                       }
                   }
               });

            if (intervalSet === false) {
                setInterval(forceRefreshPage, 30000);
                $('#routeDate').datepicker();
                $('#routeDate').datepicker('setDate', 'today');
                $('#routeDate').datepicker().on("input change", function () { forceRefreshPage(); });
                intervalSet = true;
            }

            function setStatusColorClass(row, data, index) {
                if (data.Status.trim() === '98') {
                    $(row).addClass('Completed');
                }

                if (data.Status.trim() === '22') {
                    $(row).addClass('Cancelled');
                }

                if (data.Status.trim() === 'Active') {
                    $(row).addClass('NotCompleted');
                }
            }

            function refreshPage() {
                $.get('api/RedrawOperationsDashboard')
                    .done(function (data) {
                        if (data.data[0].Column1 == true) {
                            forceRefreshPage();
                        }
                    });
            }

            function forceRefreshPage() {
                $('.dtHeader').remove();
                $('.dtTDContainer').remove();
                for (let index in dashboardTableIds) {
                    if (dashboardTableIds.hasOwnProperty(index)) {
                        dashboardTableIds[index].destroy(true);
                    }
                }
                loadDashboard();
            }

        })();


    }
    catch (e) {
        myClearwater.errorMsg(e);
    }
};