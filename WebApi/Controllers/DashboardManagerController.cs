
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Web;
using System.Web.Http;
using DataTables;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class DashboardManagerController : ApiController
    {
        [Route("api/DashboardManager")]
        [HttpGet]
        [HttpPost]
        public IHttpActionResult DashboardManager()
        {
            DtResponse response = new DtResponse();
            try
            {
                WebApiApplication.Log.Info("Enter DashboardManger Controller");
                var request = HttpContext.Current.Request;
                var loginName = request.LogonUserIdentity.Name;
                WebApiApplication.Log.Info(" User " + loginName);
                var settings = Properties.Settings.Default;
                WebApiApplication.Log.Info("Connection String: " + settings.DbConnection);
                using (var db = new Database(settings.DbType, settings.DbConnection))
                {
                    
                    var currentTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    var editor = new Editor(db, "RouteStop", "PK").Model<DashboardManagerModel>();
                    if (request.Form["action"] == "remove")
                    {
                        string inArguments = string.Empty;
                        foreach (var item in request.Form)
                        {
                            if (item.ToString().Contains("PK"))
                            {
                                inArguments = inArguments + request.Params[item.ToString()] + "','";

                            }
                        }
                        List<Dictionary<string, object>> results = null;
                        if (inArguments.Length > 2)
                        {
                            inArguments = inArguments.Substring(0, inArguments.Length - 2);
                            editor = new Editor(db, "", "");
                            var sqlCmd =
                                "UPDATE Routestop SET Deleted = 1, RouteStopChangeRefreshed = 1, LoginName = '" +
                                loginName + "' , ModifyDate= '" + currentTime + " 'FROM RouteStop WHERE PK IN ('" + inArguments + ")";
                            var queryData = editor.Db().Sql(sqlCmd);
                            results = queryData.FetchAll();
                        }
                        response.data = results;
                        return Json(response);
                    }
                    if (request.HttpMethod == "POST")
                    {
                        editor.Field(new Field("LoginName", "LoginName"));
                        editor.Field(new Field("RouteStopChangeRefreshed", "RouteStopChangeRefreshed"));
                        editor.Field(new Field("ModifyDate", "ModifyDate"));
                        editor.Field("LoginName").SetValue(loginName);
                        editor.Field("ModifyDate").SetValue(currentTime);
                        editor.Field("RouteStopChangeRefreshed").SetValue(true);

                        if (request.Form["action"] == "create")
                        {
                            editor.Field(new Field("CreateDate", "CreateDate"));
                            editor.Field("CreateDate").SetValue(currentTime);
                            editor.Field(new Field("RouteUnique", "RouteUnique", typeof(Guid)));
                            editor.Field("RouteUnique").SetValue(Guid.NewGuid());
                        }
                    }
                    editor.Field(new Field("FK_Vehicle", "FK_Vehicle"));
                    editor.Field(new Field("FK_Operator", "FK_Operator"));
                    editor.Field(new Field("FK_Radio", "FK_Radio"));
                    editor.Field(new Field("FK_Location", "FK_Location"));
                    editor.Field(new Field("Note", "Note").Validator(Validation.MaxLen(255)));
                    editor.Field(new Field("LocationAddress", "LocationAddress").Validator(Validation.MaxLen(255)));
                    editor.Field(new Field("RouteStopOrder", "Order"));

					response = editor.Where("Deleted",  false , "=").Process(request).Data();
                    if (string.IsNullOrEmpty(response.error))
                    {
                        foreach (var row in response.data)
                        {
                            WebApiApplication.Log.Info("Row");
                            foreach (var col in row)
                            {
                                WebApiApplication.Log.Info(col.Key.ToString() + ": " + col.Value);
                            }
                            WebApiApplication.Log.Info("DashboardManger Returning data to Dashboard UI");
                            return Json(response);
                        }
                    }
                    else
                    {
                        WebApiApplication.Log.Error("DashboardManger SQL Return error" + response.error);
                        return Json(response);
                    }
                }
            }
            catch (Exception ex)
            {
                WebApiApplication.Log.Error("DashboardManger Controller:" + ex);
                 return Json(response);
            }
            return Json(response);
        }
    }
}


