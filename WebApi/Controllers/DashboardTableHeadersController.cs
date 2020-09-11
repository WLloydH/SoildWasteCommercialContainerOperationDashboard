using System;
using System.Runtime.CompilerServices;
using System.Web;
using System.Web.Http;
using DataTables;
using WebApi.Models;
using log4net;

namespace WebApi.Controllers
{
    public class DashboardTableHeadersController : ApiController
    {

        [Route("api/DashboardTableHeaders")]
        [HttpGet]
        public IHttpActionResult DashboardTableHeaders()
        {
            DtResponse response =null;
            WebApiApplication.Log.Info("DashboardTableHeaders Called");
            try
            {
             
                var request = HttpContext.Current.Request;
                string routeDate = request.QueryString["RouteDate"].TrimEnd();

                var settings = Properties.Settings.Default;
                response = new DtResponse();

                using (var db = new Database(settings.DbType, settings.DbConnection))
                {
                    var editor = new Editor(db, "", "");

                    DateTime validDate = new DateTime();
                    if (DateTime.TryParse(routeDate, out validDate))
                    {
                        var queryData = editor.Db().Sql("SELECT * FROM vw_OperatorCallSignVehicleNbr WHERE Deleted = 0 and  RouteDate = '" + routeDate + "' ORDER BY DisplayRightOrder");
                        response.data = queryData.FetchAll();
                    }
                    return Json(response);
                }
            }
            catch (Exception ex)
            {
                WebApiApplication.Log.Error("DashboardTableHeaders: " + ex);
                return Json(response);

            }
        }
    }
}




