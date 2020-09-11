using System.Web;
using System.Web.Http;
using DataTables;
using System;

namespace WebApi.Controllers
{
    public class RedrawOperationsDashboardController : ApiController
    {
        [Route("api/RedrawOperationsDashboard")]
        [HttpGet]
        [HttpPost]
        public IHttpActionResult SolidWaste()
        {
            WebApiApplication.Log.Debug("RedrawOperationsDashboard Controller Called");
            DtResponse response = new DtResponse();
            var request = HttpContext.Current.Request;
            var settings = Properties.Settings.Default;
            WebApiApplication.Log.Debug(" User " + request.LogonUserIdentity.Name);
            try
            {
                using (var db = new Database(settings.DbType, settings.DbConnection))
                {
                    var editor = new Editor(db, "", "");
                                      
                    var sqlCmd = "EXEC ReDrawRoutesStops";
                    var queryData = editor.Db().Sql(sqlCmd);
                    var results = queryData.FetchAll();
                    response.data = results;
                    return Json(response);
                }
            }
            catch (Exception ex)
            {
                WebApiApplication.Log.Error("RedrawOperationsDashboard: " + ex);
                return Json(response);
            }
        }


    }
}
