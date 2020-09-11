
var myClearwater = myClearwater || {};
myClearwater.id = 0;


myClearwater.dashboardContainers = function () {
    "use strict";
    try{

        var intervalSet = false;

        (function loadDashboardContainers() {
            $.get('api/ContainerInventory')
                .done(function (data) {
                    if (data.data.length > 0) {
                        var containers = data.data[0];
                        $('#billingCycle').html('Billing Cycle: '.concat(containers.BillingCycle));
                        $(".containerSize").removeClass('hasNote');
                        $(".containerSize").removeClass('noNote');
                        $('#con10').html(containers.Container10);
                        if (containers.Container10Note.length > 0) {
                            $('#C10').addClass('hasNote');
                            $('#C10').attr("title", containers.Container10Note);
                        }
                        else {
                            $('#C10').addClass('noNote');
                            $('#C10').attr("title", containers.Container10Note);
                        }
                        $('#con20').html(containers.Container20);
                        if (containers.Container20Note.length > 0) {
                            $('#C20').addClass('hasNote');
                            $('#C20').attr("title", containers.Container20Note);
                        }
                        else {
                            $('#C20').removeClass('noNote');
                            $('#C20').attr("title", containers.Container20Note);
                        }
                        $('#con30').html(containers.Container30);
                        if (containers.Container30Note.length > 0) {
                            $('#C30').addClass('hasNote');
                            $('#C30').attr("title", containers.Container30Note);
                        }
                        else {
                            $('#C30').removeClass('noNote');
                            $('#C30').attr("title", containers.Container30Note);
                        }

                        $('#con40').html(containers.Container40);
                        if (containers.Container40Note.length > 0) {
                            $('#C40').addClass('hasNote');
                            $('#C40').attr("title", containers.Container40Note);
                        }
                        else {
                            $('#C30').removeClass('noNote');
                            $('#C30').attr("title", containers.Container30Note);

                        }

                    }
                }

                );

            if (intervalSet === false) {
                intervalSet = true;
                setInterval(loadDashboardContainers, 1000);
            }
        })();
    }
    catch (e) {
        myClearwater.errorMsg(e);
    }
};

