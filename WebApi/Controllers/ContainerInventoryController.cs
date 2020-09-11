using System;
using System.Web;
using System.Web.Http;
using DataTables;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class ContainerInventoryController : ApiController
    {

        [Route("api/ContainerInventory")]
        [HttpGet]
        [HttpPost]
        public IHttpActionResult ContainerInventory()
        {


            DtResponse response = new DtResponse();
            try
            {
                var request = HttpContext.Current.Request;
                var loginName = request.LogonUserIdentity.Name;
                WebApiApplication.Log.Info(" User " + loginName);

                var settings = Properties.Settings.Default;

                var currentTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
 
                using (var db = new Database(settings.DbType, settings.DbConnection))
                {
                    var editor = new Editor(db, "AvailableContainer", "PK");
                   
                    response = editor.Model<ContainerInventoryModel>().Process(request).Data();
                }
                return Json(response);


            }
            catch (Exception ex)
            {
                WebApiApplication.Log.Error("ContainerInventory Controller: " + ex);
                return Json(response);

            }
        }
    }
}


   
     