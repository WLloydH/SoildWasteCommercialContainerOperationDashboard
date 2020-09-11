 
var myClearwater = myClearwater || {};
    myClearwater.id = 0;
    myClearwater.UIFunctions = [];
    myClearwater.Administror = 3;
    myClearwater.Editor = 2;
    myClearwater.Readonly = 1;
    myClearwater.None = 0;
                                                    
    $.fn.dataTable.ext.errMode = 'none';
    myClearwater.containerEditor;
myClearwater.errorMsg = function errorMsg(error) {
    toastr.options.positionClass = 'toast-top-full-width';
    toastr.options.timeOut = 60000;
    toastr.options.fadeOut = 0;
    toastr.options.fadeIn = 250;
    toastr["error"]("Sorry, we have noticed a problem. Please contact the helpdesk. Thank you.");
    $.post("api/UIErrorLogger", "{message:".concat(error) + '}');
};
  
     myClearwater.setCopyrightDate = function setCopyright (){
        var d = new Date();
        $('.copyright').html('Copyright '.concat(d.getFullYear()).concat(' all rights reserved'));
     };
 
myClearwater.accessLevel = function accessLevel(ModCallBacks) {
    $.get("api/UserAccessLevel").done(function (data) {
        if (data.data.length > 0) {
            var accessValue = parseInt(data.data[0].value, 10);
            for (var i = 0, len = ModCallBacks.length; i < len; i++) {
                if (ModCallBacks[i].value <= accessValue) {
                    ModCallBacks[i].loadMod();
                }
            }
        }
        myClearwater.UIFunctions = [];
    });
};
         