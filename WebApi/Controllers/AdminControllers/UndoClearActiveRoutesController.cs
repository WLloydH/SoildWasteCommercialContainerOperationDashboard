
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
    public class DashboardManagerClearActiveRoutesController : ApiController
    {
        [Route("api/UndoClearActiveRoutes")]
        [HttpPost]
        public IHttpActionResult UndoClearActiveRoutes()
        {
            WebApiApplication.Log.Info("UndoClearActiveRoutes Controller");
            var request = HttpContext.Current.Request;
            var settings = Properties.Settings.Default;
            DtResponse response = new DtResponse();
            try
            {
                var sqlConn = new SqlConnection(settings.DbConnection);
                var sql = new SqlCommand();
                sql.Connection = sqlConn;
                sql.CommandType = CommandType.StoredProcedure;
                sql.CommandText = "[dbo].[UndoClearActiveRoutes]";
                sqlConn.Open();
                sql.ExecuteNonQuery();
                return Json(response.data = null);
            }
            catch (Exception ex)
            {
                 WebApiApplication.Log.Error("UndoClearActiveRoutes Controller: " + ex);
                return Json(response.data = null);
            }
        }
    }
}


