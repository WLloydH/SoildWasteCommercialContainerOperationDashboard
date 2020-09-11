

myClearwater.setupDashboardManager = function setupDashboardManager() {
    myClearwater.getCurrentMasterLists(activateDashboardRouteManager);

};

function activateDashboardRouteManager() {
    "use strict";

    try {
        $('#minRouteDate').datepicker();
        $('#minRouteDate').datepicker('setDate', 'today');
        $('#maxRouteDate').datepicker();
        $('#maxRouteDate').datepicker('setDate', 'today');


        var statusOptions = [{ label: "", value: "Active" }, { label: "98", value: "98" }, { label: "22", value: "22" }];
        var noteOptions = [{ label: "Compactor", value: "Compactor" }, { label: "Roll-Off", value: "Roll-Off" }];
        var routeStatusOptions = [{ label: "Active", value: "Active" }, { label: "Planned", value: "Planned" }, { label: "Complete", value: "Complete" }];
        var rollOffOptions = [{ label: "Dump and Return", value: "Dump and Return" }, { label: "Dump and Remove", value: "Dump and Remove" }, { label: "Dump and Relocate", value: "Dump and Relocate" }, { label: "Relocate", value: "Relocate" }, { label: "Delivery", value: "Delivery" }, { label: "In-Kind", value: "In-Kind" }, { label: "None", Value: "None" }];


        var routesEditor = new $.fn.dataTable.Editor({
            ajax: 'api/DashboardManager',
            table: '#RouteManager',
            i18n: {
                create: {
                    button: "Add New Stops",
                    title: "Add New Stops"
                },
                edit: {
                    button: "Edit Selected Stops",
                    title: "Edit Selected Stops"
                }
            },
            fields: [
                {
                    label: 'Operator:',
                    name: 'FK_Operator',
                    type: 'select',
                    options: myClearwater.operatorList,
                    def: 1
                },
                {
                    label: 'Vehicle:',
                    name: 'FK_Vehicle',
                    type: 'select',
                    options: myClearwater.vehicleList,
                    def: 1
                },
                {
                    label: 'Location:',
                    name: 'FK_Location',
                    type: "select",
                    options: myClearwater.locationList,
                    def: 1
                },
                {
                    label: 'Location Address:',
                    name: 'LocationAddress',
                    type: "text"                    
                },
                {
                    label: 'Call Sign:',
                    name: 'FK_Radio',
                    type: "select",
                    options: myClearwater.radioList,
                    def: 1
                },
                {
                    label: 'Status:',
                    name: 'Status',
                    value: 'PK',
                    type: "select",
                    options: statusOptions,
                    def: "Active"

                },
                {
                    label: 'Type:',
                    name: 'Note',
                    type: "select",
                    options: noteOptions,
                    def: "Compactor"
                },
                {
                    label: 'Job Type:',
                    name: 'RollOff',
                    type: "select",
                    options: rollOffOptions,
                    data: function (data, type, set) {
                        return data.RollOff;
                    },
                    def: "Dump and Return"

                },
                {
                    label: 'Scheduled Route Date:',
                    name: 'RouteDate',
                    data: function (data, type, set) {
                        return moment(data.RouteDate).format("MMM DD YYYY");
                    },
                    type: 'datetime',
                    def: moment().format("MMM DD YYYY")

                },
                { name: 'Order:', type: "hidden", def: 100 },
                { name: 'CreateDate', type: "hidden" },
                { name: 'ModifyDate', type: "hidden" },
                { name: 'LoginName', type: "hidden" },
                { name: 'RouteUnique', type: "hidden" }
            ]
        });

        $('#RouteManager').on('dblclick', 'tbody tr', function (e) {
            routesEditor.title('Edit Selected Stop').buttons('Update').edit(this);
        });
        
        var routeManagerDT = $('#RouteManager')
            .DataTable({
                dom: 'Bfptli',
                rowId: 'PK',
                ajax: {
                    url: 'api/DashboardManager'
                },
				"order": [[1, "asc"], [2, "asc"], [8, "asc"]],			
                columns: [
                     {
                         data: 'Operator',
                         render: function (data, type, row) {
                             var result = $.grep(myClearwater.operatorList,
                                 function (e) {
                                     return e.value == row.FK_Operator;
                                 });
                             if (result.length > 0) {
                                 return result[0].label;
                             }
                             return '';
                         }
                     },
                    {
                        data: 'Vehicle',
                        render: function (data, type, row) {
                            var result = $.grep(myClearwater.vehicleList,
                                function (e) {
                                    return e.value == row.FK_Vehicle;
                                });
                            if (result.length > 0) {
                                return result[0].label;
                            }
                            return '';
                        }
                    },
                    {
                        data: 'Location',
                        render: function (data, type, row) {
                            var result = $.grep(myClearwater.locationList,
                                function (e) {
                                    return e.value == row.FK_Location;
                                });
                            if (result.length > 0) {
                                return result[0].label;
                            }
							return '';

                        }
                    },
                    {
						data: 'Location Address',
                        render: function (data, type, row) {
                            return row.LocationAddress;
                        }
                    },
                    {
                        data: 'Call Sign',
                        render: function (data, type, row) {
                            var result = $.grep(myClearwater.radioList,
                                function (e) {
                                    return e.value == row.FK_Radio;
                                });
                            if (result.length > 0) {
                                return result[0].label;
                            }
                            return '';

                        }
                    },
                    {
                        data: 'Status',
                        render: function (data, type, row) {
                            if (row.Status === 'Active') {
                                return '';
                            }
                            return row.Status;
                        }
                    },
                    {
                        data: 'Type',
                        render: function (data, type, row) {
                            return row.Note;
                        }
                    },
                    {
                        data: 'Job Type',
                        render: function (data, type, row) {
                            return row.RollOff;
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
                        data: 'Order',
                        render: function (data, type, row) {
                            return row.Order;
                        },
                        visible: false,
                        searchable: false

                    },
                    {
                        data: 'RouteUnique',
                        visible: false,
                        searchable: false
                    },
                    {
                        data: 'Login Name',
                        render: function (data, type, row) {
                            return row.LoginName;
                        },
                        visible: false,
                        searchable: false

                    },
                    {
                        data: 'Create Date',
                        render: function (data, type, row) {
                            return row.CreateDate;
                        },
                        visible: false,
                        searchable: false

                    },
                    {
                        data: 'Modify Date',
                        render: function (data, type, row) {
                            return row.ModifyDate;
                        },
                        visible: false,
                        searchable: false
 
                    },
                    {
                        data: 'Deleted',
                        render: function (data, type, row) {
                            return row.Deleted;
                        },
                        visible: false,
                        searchable: false
                    }
                ],
                'lengthMenu': [[10, 20, 50, 100, 250, -1], [10, 20, 50, 100, 250, "All"]],
                select: true,
                buttons: [
                    {
                        extend: 'create',
                        editor: routesEditor,
                        text: "Add New Stops",
                        tittle: 'Add New Stops',
                        formButtons: [
                                {
                                    label: 'Save and Continue',
                                    fn: function () {
                                        var that = this;
                                        this.submit(function (d) {
                                            try {
                                                if (d.data.length > 0) {
                                                    let initData = d.data[0];
                                                    that.field('FK_Operator').def(initData.FK_Operator);
                                                    that.field('FK_Vehicle').def(initData.FK_Operator);
                                                    that.field('FK_Radio').def(initData.FK_Radio);
                                                    that.field('FK_Radio').def(initData.FK_Radio);
                                                    that.field('RouteDate').def(moment(initData.RouteDate).format("MMM DD YYYY"));
                                                    that.create();
                                                    toastr["info"]("Stop added");
                                                }
                                            }
                                            catch (e) {
                                                myclearwater.errorMsg(e);
                                            }
                                        }
                                        );
                                    }
                                }
                        ]
                    },
                    { extend: 'edit', editor: routesEditor, text: "Edit Selected Stops", tittle: 'Edit Selected Stops' },
                    {
                        extend: 'remove',
                        editor: routesEditor,
                        text: "Delete Selected Stops"
                    }
                ]
            });

        routesEditor.dependent('FK_Operator',
               function (val) {
                   var result = $.grep(myClearwater.operatorList, function (e) { return e.value == val; });
                   if (result.length > 0) {

                       if ('create'.localeCompare(routesEditor.mode()) === 0) {
                           return {
                               "values": {
                                   "FK_Vehicle": result[0].assignedVehicle,
                                   "FK_Radio": result[0].assignedRadio
                               }
                           };
                       }
                       if ('edit'.localeCompare(routesEditor.mode()) === 0) {
                           return {

                               "values": {
                                   "FK_Vehicle": result[0].assignedVehicle,
                                   "FK_Radio": result[0].assignedRadio
                               }
                           };
                       }
                   }
                   return {};
               });


        routesEditor.on('preSubmit',
            function validatePreSubmitData(e, d) {
                if (this.val('LocationAddress') !== undefined) {
                    if (this.val('LocationAddress').length > 255) {
                        this.error('LocationAddress', 'LocationAddress is too long. Please limit length to 255');
                        return false;
                    }
                }
                return true;
            });


        routesEditor.on('postSubmit', function (e, json, data, action, xhr) {
            if (json.error !== null) {
                clearInterval(interval);
                myClearwater.errorMsg(json.error);
                json.error = null;
            }
        });

        $('#RouteManager').on('error.dt', function (e, settings, techNote, message) {
            clearInterval(interval);
            myClearwater.errorMsg(message);
        });

        $('#RouteManager').on('xhr.dt', function (e, settings, json, xhr) {
            if (json) {
                if (json.error !== null) {
                    clearInterval(interval);
                    myClearwater.errorMsg(json.error);
                    json.error = null;
                }
            }
        });

        $.fn.dataTable.ext.search.push(
            function (settings, data, dataIndex) {
                var minRouteDate = moment(new Date($('#minRouteDate').val()));
                var maxRouteDate = moment(new Date($('#maxRouteDate').val()));
                var routeDate = moment(new Date(data[8]));          
                if (minRouteDate.diff(routeDate)<= 0 && maxRouteDate.diff(routeDate) >=0) {
                    return true;
                }
                    return false;
        });


        var interval = setInterval(function reloadManagerData() {
            myClearwater.getCurrentMasterLists();
            routeManagerDT.ajax.reload(null, false);
        }, 2500);
    }
    catch (e) {
        myClearwater.errorMsg(e);
    }

}



