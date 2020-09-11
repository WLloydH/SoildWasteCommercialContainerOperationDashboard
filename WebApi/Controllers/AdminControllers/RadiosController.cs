using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using DataTables;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class
        RadioController : ApiController
    {
        [Route("api/Radios")]
        [HttpGet]
        [HttpPost]
        public IHttpActionResult Radios()
        {
            WebApiApplication.Log.Info("Enter Radios Controller");
            var request = HttpContext.Current.Request;
            var loginName = request.LogonUserIdentity.Name;
            WebApiApplication.Log.Info(" User " + loginName);

            var settings = Properties.Settings.Default;
            DtResponse response = new DtResponse();
            try
            {
                using (var db = new Database(settings.DbType, settings.DbConnection))
                {
                    var editor = new Editor(db, "Radio", "PK");
                    if (request.HttpMethod == "POST")
                    {
                        var currentTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
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
                                string no = "1";
                                var sqlCmd = "UPDATE Radio SET Deleted = 1,  LoginName = '" + loginName + "' , ModifyDate= '" + currentTime + "' FROM Radio WHERE PK IN ('" + inArguments + ")  AND PK != " + no;

                                var queryData = editor.Db().Sql(sqlCmd);


                                results = queryData.FetchAll();
                            }
                            response.data = results;
                            return Json(response);
                        }

                        editor.Field(new Field("LoginName"));
                        editor.Field(new Field("ModifyDate"));
                        editor.Field(new Field("CallSign", "RadioNbr"));

                        editor.Field("LoginName").SetValue(loginName);
                        editor.Field("ModifyDate").SetValue(currentTime);

                        if (request.Form["action"] == "create")
                        {
                            editor.Field(new Field("CreateDate"));
                            editor.Field("CreateDate").SetValue(currentTime);
                        }
                    }
                     response = editor.Model<RadioModel>().Where("Deleted", false, "=").Process(request).Data();
                }
                return Json(response);
            }
            catch (Exception ex)
            {
                WebApiApplication.Log.Error("Radios Controller: " + ex);
                return Json(response);
            }
        }
    }
}

