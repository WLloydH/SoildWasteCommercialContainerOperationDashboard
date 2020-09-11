
myClearwater.setupOperatorAdmin = function setupDashboardManager() {
    myClearwater.getCurrentMasterLists(activateOperatorManager);

}


function activateOperatorManager() {
    try {
        var activeOperatorsEditor = new $.fn.dataTable.Editor({
            ajax: 'api/Operators',
            table: '#activeOperators',
            fields: [
                {
                    label: 'Operator:',
                    name: 'OperatorName'
                },
                {
                    label: 'Vehicle:',
                    name: 'FK_Vehicle',
                    type: 'select',
                    options: myClearwater.vehicleList
                },
                {
                    label: 'Call Sign:',
                    name: 'FK_Radio',
                    type: "select",
                    options: myClearwater.radioList
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


        var activeOperatorDataTable = $('#activeOperators')
            .DataTable({
                dom: '<Bftpi>',
                    ajax: 'api/Operators', 
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
                    ], columnDefs: [
                        { "targets": 3, "visible": false, "searchable": false },
                        { "targets": 4, "visible": false, "searchable": false },
                        { "targets": 5, "visible": false, "searchable": false }                   
                    ],
                    select: { style: 'single' },
                    buttons: [
                        { extend: 'create', editor: activeOperatorsEditor },
                        { extend: 'edit', editor: activeOperatorsEditor },
                        { extend: 'remove', editor: activeOperatorsEditor }
                    ]
                });


        activeOperatorsEditor.on('preSubmit',
        function validatePreSubmitData(eValidate, d) {
 
            if (this.val('OperatorName') !== undefined) {
                
                if (this.val('OperatorName').trim().length > 50) {
                    this.error('OperatorName', 'Operator Name is too long. Please limit length to 50');
                    return false;  }
                if ('create'.localeCompare(activeOperatorsEditor.mode()) === 0) {
                    var operatorName = this.val('OperatorName')
                    var result = $.grep(myClearwater.operatorList,
                                        function (e) {
                                            return e.label == operatorName;
                                        });
                    if (result.length > 0) {
                        this.error('OperatorName', 'Operator name  already added');
                        return false;
                    }
                }
            }
            return true;
        });

        activeOperatorsEditor.on('postSubmit', function (e, json, data, action, xhr) {
            if (json.error !== null) {
                clearInterval(interval);
                myClearwater.errorMsg(json.error);
                json.error = null
            }
        });

        $('#activeOperators').on('error.dt', function (e, settings, techNote, message) {
            clearInterval(interval);
            myClearwater.errorMsg(message)
        });

        $('#activeOperators').on('xhr.dt', function (e, settings, json, xhr) {
            if (json) {
                if (json.error !== null) {
                    clearInterval(interval);
                    myClearwater.errorMsg(json.error);
                    json.error = null
                }
            }
        });

        var interval = setInterval(function reloadActiveOperatorDataTable() {
            myClearwater.getCurrentMasterLists();
            activeOperatorDataTable.ajax.reload(null, false);
        }, 1000);
    }
    catch (e) {
        myClearwater.errorMsg(e)
    }

};