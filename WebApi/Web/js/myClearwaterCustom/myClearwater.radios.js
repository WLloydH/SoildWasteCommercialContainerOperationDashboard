"use strict";

myClearwater.radios = function () {
    
    try {
        var activeRadioEditor = new $.fn.dataTable.Editor({
            ajax: 'api/Radios',
            table: '#activeRadios',
            fields: [
                { label: 'Call Sign:', name: 'CallSign' },
                { name: 'LoginName', type: "hidden" },
                { name: 'CreateDate', type: "hidden" },
                { name: 'ModifyDate', type: "hidden" }
            ]
        });
    

        var activateRadioDT =  $('#activeRadios').DataTable({
            dom: '<Bftpi>',
            rowId: 'PK',
            ajax: 'api/Radios',

            columns: [
                { data: 'Call Sign', render: function (data, type, row) { return row.CallSign; }, class:"dtCenter"},
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
                   { "targets": 3, "visible": false, "searchable": false },
            ],
            select: { style: 'single' },
            buttons: [
                { extend: 'create', editor: activeRadioEditor },
                { extend: 'edit', editor: activeRadioEditor },
                { extend: 'remove', editor: activeRadioEditor }
            ]
        });
        activeRadioEditor.on('preSubmit', function validatePreSubmitData(e, d) {
            
            if (this.val('CallSign') !== undefined) {
                var callSign = this.val('CallSign')
                if (this.val('CallSign').trim().length > 3) {
                    this.error('CallSign', 'Call Sign is too long. Please limit length to 3');
                    return false;
                }

                var result = $.grep(myClearwater.radioList,
                                    function (e) {
                                        return e.label == callSign;
                                    });
                if (result.length > 0) {
                    this.error('CallSign', 'Call Sign  already added');
                    return false;
                }
            }
           return true;
       });
        activeRadioEditor.on('postSubmit', function (e, json, data, action, xhr) {
            if (json.error !== null) {
                clearInterval(interval);
                myClearwater.errorMsg(json.error);
                json.error = null
            }
        });

        $('#activeRadios').on('error.dt', function (e, settings, techNote, message) {
            clearInterval(interval);
            myClearwater.errorMsg(message)
        });

        $('#activeRadios').on('xhr.dt', function (e, settings, json, xhr) {
            if (json) {
                if (json.error !== null) {
                    clearInterval(interval);
                    myClearwater.errorMsg(json.error);
                    json.error = null
                }
            }
        });

        var interval = setInterval(function reloadRadiosData() { activateRadioDT.ajax.reload(null, false); }, 1000);

    }
    catch (e) {
        myClearwater.errorMsg(e)
    }
}  
