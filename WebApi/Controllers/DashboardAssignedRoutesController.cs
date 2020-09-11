using System.Web;
using System.Web.Http;
using DataTables;

namespace WebApi.Controllers
{
    public class DashboardAssignedRoutesController : ApiController
    {
        [Route("api/DashboardAssignedRoutes")]
        [HttpGet]
        public IHttpActionResult DashboardAssignedRoutes()
        {
            DtResponse response= new DtResponse();
            try
            {
                WebApiApplication.Log.Info("Enter DashboardAssignedRoutes Controller");
                var request = HttpContext.Current.Request;
                var loginName = request.LogonUserIdentity.Name;
                WebApiApplication.Log.Info(" User " + loginName);

                var settings = Properties.Settings.Default;

                string vehicleNbr = request.QueryString["VehicleNbr"].TrimEnd();
                string operatorName = request.QueryString["OperatorName"].TrimEnd();
                string callSign = request.QueryString["CallSign"].TrimEnd();
                string routeDate = request.QueryString["RouteDate"].TrimEnd();

                using (var db = new Database(settings.DbType, settings.DbConnection))
                {
                    var editor = new Editor(db, "GetAssignedRoutes", "");
                    var sqlCmd = "EXEC GetAssignedRoutes '" + operatorName + "','" + vehicleNbr + "','" + callSign + "','" + routeDate + "'";
                    var queryData = editor.Db().Sql(sqlCmd);
                    var results = queryData.FetchAll();
                    response.data = results;
                }
                if (string.IsNullOrEmpty(response.error))
                {
                    foreach (var row in response.data)
                    {
                        WebApiApplication.Log.Debug("Row");
                        foreach (var col in row)
                        {
                            WebApiApplication.Log.Debug(col.Key.ToString() + ": " + col.Value);
                        }
                        WebApiApplication.Log.Debug("DashboardAssignedRoutes  Returning data to Dashboard UI");
                        return Json(response);
                    }
                }
                else
                {
                    WebApiApplication.Log.Error("DashboardAssignedRoutes SQL Return error" + response.error);
                    return Json(response);
                }
            }
            catch (System.Exception ex)
            {
                WebApiApplication.Log.Error("DashboardAssignedRoutes Controller: " + ex);
                return Json(response);
            }
           
            return Json(response);
        }
    }
}

