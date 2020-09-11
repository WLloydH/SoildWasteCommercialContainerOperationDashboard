using System;
using System.Linq;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using DataTables;
using WebApi.Models;
using System.Data;
using System.Data.SqlClient;

namespace WebApi.Controllers
{
    public class DailyRolloffRptController : ApiController
    {
        [Route("api/DailyRolloff")]
        [HttpGet]
        public IHttpActionResult DailyRolloffRpt()
        {
            WebApiApplication.Log.Info("Enter Daily Rolloff Rpt Controller");
            var request = HttpContext.Current.Request;
            var settings = Properties.Settings.Default;
            DtResponse response = new DtResponse();
            try
            {
                WebApiApplication.Log.Info("User "+ request.LogonUserIdentity.Name);
                using (var db = new Database(settings.DbType, settings.DbConnection))
                {                   
                    var editor = new Editor(db, "", "");
                    var sqlCmd = "EXECUTE DailyRolloffLoadCounts";
                    var queryData = editor.Db().Sql(sqlCmd);

                    var results = queryData.FetchAll();
                    response.data = results;
                    return Json(response);
                }
            }            
            catch (Exception ex)
            {
                WebApiApplication.Log.Error("Daily Rolloff Rpt Controller: " + ex);
                return Json(response);
            }
        }

    }
}

