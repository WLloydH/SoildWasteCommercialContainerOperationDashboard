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
    public class UserAccessLevelController : ApiController
    {
        [Route("api/UserAccessLevel")]
        [HttpGet]
        public IHttpActionResult UserAccessLevel()
        {
            WebApiApplication.Log.Info("Enter User Access Level Controller");
            var request = HttpContext.Current.Request;
            WebApiApplication.Log.Info("User " + request.LogonUserIdentity.Name);
            var settings = Properties.Settings.Default;
            DtResponse response = new DtResponse();
            try
            {
                var currentTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                var loginName = request.LogonUserIdentity.Name;
                var sAMAccountName = loginName.Substring(loginName.LastIndexOf(@"\") + 1);
                using (var db = new Database(settings.DbType, settings.DbConnection))
                {
                    var editor = new Editor(db, "", "");
                    var sqlCmd = "Select sAMAccountName, level, value FROM  UserAdmin WHERE UPPER(sAMAccountName) ='" + sAMAccountName.ToUpper() +"'";
                    WebApiApplication.Log.Debug("SQL " + sqlCmd);
                    var queryData = editor.Db().Sql(sqlCmd);
                    var results = queryData.FetchAll();
                    response.data = results;
                    return Json(response);
                }                
            }            
            catch (Exception ex)
            {
                WebApiApplication.Log.Error("User Admin Controller: " + ex);
                return Json(response);
            }
        }

    }
}

