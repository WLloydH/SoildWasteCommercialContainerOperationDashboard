
myClearwater.containerInventory = function containerInventory() {
    try {
        "use strict";
        myClearwater.containerEditor = new $.fn.dataTable.Editor({
            ajax: "api/ContainerInventory",
            fields: [

                {
                    label: 'Current Billing Cycle:',
                    name: 'BillingCycle'
                },
                {
                    label: '10 Yard On Hand:',
                    name: "Container10"
                },
                {
                    label: 'Note:',
                    name: 'Container10Note'
                },
                {
                    label: '20 Yard On Hand:',
                    name: "Container20"
                },
                {
                    label: 'Note:',
                    name: 'Container20Note'
                },
                {
                    label: '30 Yard On Hand:',
                    name: "Container30"
                },
                {
                    label: 'Note:',
                    name: 'Container30Note'
                },
                {
                    label: '40 Yard On Hand:',
                    name: "Container40"
                },
                {
                    label: 'Note:',
                    name: 'Container40Note'
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

        loadEditor();

        myClearwater.containerEditor.on('preClose', function () {
            loadEditor();
            return false;
        });


        function loadEditor() {
            $.get("api/ContainerInventory").done(function (data) {
                myClearwater.containerEditor.edit("row_1")
                    .title("")
                    .buttons({
                        label: "Route Manager", fn: function () {
                            this.submit();
                        }

                    }).
                    buttons({
                        label: "Save", fn: function () {
                            this.submit();
                        }
                    })
                    .set('BillingCycle', data.data[0].BillingCycle)
                    .set('Container10', data.data[0].Container10)
                    .set('Container20', data.data[0].Container20)
                    .set('Container30', data.data[0].Container30)
                    .set('Container40', data.data[0].Container40)
                    .set('Container10Note', data.data[0].Container10Note)
                    .set('Container20Note', data.data[0].Container20Note)
                    .set('Container30Note', data.data[0].Container30Note)
                    .set('Container40Note', data.data[0].Container40Note);
            });
        }


        myClearwater.containerEditor.on('preSubmit', function validatePreSubmitData(e, d) {
            if (this.val('Container10Note') !== undefined) {
                if (this.val('Container10Note').length > 255) {
                    this.error('Container10Note', 'Container 10 Note is too long. Please limit length to 255');
                    return false;
                }
            }
            if (this.val('Container20Note') !== undefined) {
                if (this.val('Container20Note').length > 255) {
                    this.error('Container20Note', 'Container 20 Note is too long. Please limit length to 255');
                    return false;
                }
            }
            if (this.val('Container30Note') !== undefined) {
                if (this.val('Container30Note').length > 255) {
                    this.error('Container30Note', 'Container 30 Note is too long. Please limit length to 255');
                    return false;
                }
            }
            if (this.val('Container40Note') !== undefined) {
                if (this.val('Container40Note').length > 255) {
                    this.error('Container40Note', 'Container 40 Note is too long. Please limit length to 255');
                    return false;
                }
            }

            if (isNaN(this.val('BillingCycle')) === false) {
                if (parseInt(this.val('BillingCycle'), 10) > 365) {
                    this.error('BillingCycle', 'Billing Cycle. Please limit  to 365 day');
                    return false;
                }
            }
            else {
                this.error('BillingCycle', 'Billing Cycle. Please limit to 365 days');
                return false;
            }



            if (isNaN(this.val('Container10')) === false) {
                if (parseInt(this.val('Container10'), 10) > 200) {
                    this.error('Container10', 'Please limit to 200');
                    return false;
                }
            }
            else {
                this.error('Container10', 'Please limit  to 200');
                return false;
            }



            if (isNaN(this.val('Container20')) === false) {
                if (parseInt(this.val('Container20'), 10) > 200) {
                    this.error('Container20', 'Please limit length to 200');
                    return false;
                }
            }
            else {
                this.error('Container20', 'Please limit to 200');
                return false;
            }



            if (isNaN(this.val('Container30')) === false) {
                if (parseInt(this.val('Container30'), 10) > 200) {
                    this.error('Container30', 'Please limit  to 200');
                    return false;
                }
            }
            else {
                this.error('Container30', 'Please limit  to 200');
                return false;
            }


            if (isNaN(this.val('Container40')) === false) {
                if (parseInt(this.val('Container40'), 10) > 200) {
                    this.error('Container40', 'Please limit  to 200');
                    return false;
                }
            }
            else {
                this.error('Container40', 'Please limit  to 200');
                return false;
            }

            return true;
        });


        myClearwater.containerEditor.on('postSubmit', function (e, json, data, action, xhr) {
            if (json.error !== null) {
                myClearwater.errorMsg(json.error);
                json.error = null;
            }
            else {
                toastr["info"]("Inventory Change Successfull");

            }
        });

    }

    catch (e) {
        myClearwater.errorMsg(e);
    }
};