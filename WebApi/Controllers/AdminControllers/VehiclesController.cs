using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using DataTables;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class VehicleController : ApiController
    {
        [Route("api/Vehicles")]
        [HttpGet]
        [HttpPost]
        public IHttpActionResult Vehicles()
        {
            WebApiApplication.Log.Info("Enter Vehicles Controller");

            var request = HttpContext.Current.Request;
            var loginName = request.LogonUserIdentity.Name;
            WebApiApplication.Log.Info(" User " + loginName);

            var settings = Properties.Settings.Default;
            DtResponse response = new DtResponse();
            try
            {
                var currentTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
 
                using (var db = new Database(settings.DbType, settings.DbConnection))
                {

                    var editor = new Editor(db, "Vehicle", "PK");
                    if (request.HttpMethod == "POST")
                    {
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
                                string none = "1";
                                var sqlCmd = "UPDATE Vehicle SET Deleted = 1,  LoginName = '" + loginName + "' , ModifyDate= '" + currentTime + "' FROM Vehicle WHERE PK IN ('" + inArguments + ") AND PK != " + none;

                                var queryData = editor.Db().Sql(sqlCmd);

                                results = queryData.FetchAll();
                            }
                            response.data = results;
                            return Json(response);
                        }

                        editor.Field(new Field("LoginName"));
                        editor.Field(new Field("ModifyDate"));
                        editor.Field("LoginName").SetValue(loginName);
                        editor.Field("ModifyDate").SetValue(currentTime);

                        if (request.Form["action"] == "create")
                        {
                            editor.Field(new Field("CreateDate"));
                            editor.Field("CreateDate").SetValue(currentTime);
                        }
                    }
                    response = editor.Model<VehicleModel>().Where("Deleted", false, "=").Process(request).Data();

                }
                return Json(response);
            }
            catch (Exception ex)
            {
                WebApiApplication.Log.Error("Vehicles Controller: " + ex);
                return Json(response);
            }

        }
    }
}

