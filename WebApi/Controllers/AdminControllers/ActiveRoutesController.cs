
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq.Expressions;
using System.Web;
using System.Web.Http;
using DataTables;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class ActiveRoutesController : ApiController
    {
        [Route("api/ActiveRoutes")]
        [HttpPost]
        [HttpGet]
        public IHttpActionResult ActiveRoutes()
        {
            WebApiApplication.Log.Info("Enter ActiveRoutes Controller");
            var request = HttpContext.Current.Request;
            var settings = Properties.Settings.Default;
            DtResponse response = new DtResponse();
            try
            {
                if (request.HttpMethod == "POST")
                {
                    using (var db = new Database(settings.DbType, settings.DbConnection))
                    {
                        var editor = new Editor(db, "[dbo].[vw_OperatorCallSignVehicleNbr]", "Id");
                        var sqlCmd = "EXEC [dbo].[ClearActiveRoutes]";
                        var queryData = editor.Db().Sql(sqlCmd);
                        var results = queryData.FetchAll();
                        response.data = results;
                        return Json(response);
                    }
                }
                if (request.HttpMethod == "GET")
                {
                    using (var db = new Database(settings.DbType, settings.DbConnection))
                    {
                            var editor = new Editor(db, "", "");
                                var queryData = editor.Db().Sql("SELECT * FROM vw_OperatorCallSignVehicleNbr WHERE RouteDate <= '" + DateTime.Now.ToShortDateString() + "'");
                                response.data = queryData.FetchAll();
                            return Json(response);
                        }
                     }
                
                return Json(response);
            }
            catch (Exception ex)
            {
                WebApiApplication.Log.Error("ActiveRoutes Controller: " + ex);
                return Json(response.data = null);
            }
        }
    }
}


