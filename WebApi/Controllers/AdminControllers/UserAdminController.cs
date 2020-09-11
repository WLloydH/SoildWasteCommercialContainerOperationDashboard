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
    public class UserAdminController : ApiController
    {
        [Route("api/UserAdmin")]
        [HttpGet]
        [HttpPost]
        public IHttpActionResult UserAdmin()
        {
            WebApiApplication.Log.Info("Enter User Admin Controller");
            var request = HttpContext.Current.Request;
            var settings = Properties.Settings.Default;
            DtResponse response = new DtResponse();
            try
            {
                var currentTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                var loginName = System.Security.Principal.WindowsIdentity.GetCurrent().Name;
                WebApiApplication.Log.Info("User "+ request.LogonUserIdentity.Name);

                using (var db = new Database(settings.DbType, settings.DbConnection))
                {
                    if (request.HttpMethod == "POST")
                    {
                        var sqlConn = new SqlConnection(settings.DbConnection);
                        var sql = new SqlCommand();

                        sql.Connection = sqlConn;
                        sql.CommandType = CommandType.StoredProcedure;
                        sql.CommandText = "UpdateUserLevel";
                        sql.Parameters.Add("@sAMAccountName", SqlDbType.Char);
                        sql.Parameters.Add("@EmplID", SqlDbType.Char);
                        sql.Parameters.Add("@Level", SqlDbType.Char);
                        sql.Parameters.Add("@value", SqlDbType.Char);
                        
                       
                        sql.Parameters["@sAMAccountName"].Value = request.Form[1];
                        sql.Parameters["@EmplID"].Value = request.Form[2];
                        sql.Parameters["@Level"].Value = request.Form[3];

                       
                        if (request.Form[3] == "Administrator")
                        {
                            sql.Parameters["@Value"].Value = 3;
                        }
                        else if (request.Form[3] == "Editor")
                        {
                            sql.Parameters["@Value"].Value = 2;
                        }
                        else if (request.Form[3] == "Read Only")
                        {
                            sql.Parameters["@Value"].Value = 1;
                        }
                        else
                        {
                            sql.Parameters["@Value"].Value = 0;
                        }

                        sqlConn.Open();
                        sql.ExecuteNonQuery();                        
                    }
                    var editor = new Editor(db, "", "");
                    var sqlCmd = "Select lu.sAMAccountName, lu.EmplID,  isnull(Level, 'None')[Level] FROM Common.dbo.LDAP_Users lu LEFT JOIN UserAdmin on UserAdmin.EmplID = lu.EmplID WHERE lu.EmplID > 1";
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

