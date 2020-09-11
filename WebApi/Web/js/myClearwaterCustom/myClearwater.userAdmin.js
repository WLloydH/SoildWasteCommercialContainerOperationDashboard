
myClearwater.userAdmin = function userAdmin() {
    "use strict";
    try {

        var userLevels = [{ label: "Administrator", value: "Administrator" }, { label: "Editor", value: "Editor" }, { label: "Read Only", value: "Read Only" }, { label: "None", value: "None" }];

        var userAdminEditor = new $.fn.dataTable.Editor({
            ajax: 'api/UserAdmin',
            table: '#userAdmin',
            idSrc: 'EmplID',
            fields: [
                {
                    label: 'User Name:',
                    name: 'sAMAccountName',
                    type: 'readonly'

                },
                {
                    label: 'ID:',
                    name: "EmplID",
                    type: 'readonly'
                },
                {
                    label: 'Access:',
                    name: "Level",
                    type: 'select',
                    options: userLevels
                }

            ]
        });


        var userAdminDT = $('#userAdmin')
            .DataTable({
                dom: '<Bftpi>',
                ajax: 'api/UserAdmin',
                rowId: 'ID',
                columns: [
                    {
                        data: 'User Name',
                        render: function (data, type, row) {
                            return row.sAMAccountName;
                        }
                    },
                    {
                        data: 'ID',
                        render: function (data, type, row) {
                            return row.EmplID;
                        }
                    },
                    {
                        data: 'Access',
                        render: function (data, type, row) {
                            return row.Level;
                        }
                    }
                ],

                select: { style: 'single' },
                buttons: [
                    { extend: 'edit', editor: userAdminEditor }
                ]
            });


        userAdminEditor.on('postSubmit', function (e, json, data, action, xhr) {
            if (json.error !== null) {
                clearInterval(interval);
                myClearwater.errorMsg(json.error);
                json.error = null;
            }
        });

        $('#userAdmin').on('error.dt', function (e, settings, techNote, message) {
            clearInterval(interval);
            myClearwater.errorMsg(message);
        });

        $('#userAdmin').on('xhr.dt', function (e, settings, json, xhr) {
            if (json) {
                if (json.error !== null) {
                    clearInterval(interval);
                    myClearwater.errorMsg(json.error);
                    json.error = null;
                }
            }
        });

        var interval = setInterval(function reloadUserAdminData() { userAdminDT.ajax.reload(null, false); }, 10000);

    }
    catch (e) {

        myClearwater.errorMsg(e);
    }

};

