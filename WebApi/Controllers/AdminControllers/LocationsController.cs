using System;
using System.Linq;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using DataTables;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class LocationController : ApiController
    {
        [Route("api/Locations")]
        [HttpGet]
        [HttpPost]
        public IHttpActionResult Locations()
        {
            WebApiApplication.Log.Info("Enter Locations Controller");
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
                    var editor = new Editor(db, "Location", "PK");
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
                                var sqlCmd = "UPDATE Location SET Deleted = 1,  LoginName = '" + loginName + "' , ModifyDate= '" + currentTime + "' FROM Location WHERE PK IN ('" + inArguments + ")";

                                var queryData = editor.Db().Sql(sqlCmd);

                                results = queryData.FetchAll();
                            }
                            response.data = results;
                            return Json(response);
                        }

                        editor.Field(new Field("LoginName"));
                        editor.Field(new Field("ModifyDate"));
                        editor.Field(new Field("LocationName").Xss(false));

                        editor.Field("LoginName").SetValue(loginName);
                        editor.Field("ModifyDate").SetValue(currentTime);

                    

                        if (request.Form["action"] == "create")
                        {
                            editor.Field(new Field("CreateDate"));
                            editor.Field("CreateDate").SetValue(currentTime);
                        }
                       
                    }
                    response = editor.Model<LocationModel>().Where("Deleted", false, "=").Process(request).Data();                    
                    var reponseData = new Dictionary<string, object>();
                    foreach( var item in response.data)
                    {
                        reponseData.Add(item["LocationName"].ToString(), item);
                    }
                    var responseDataSortedLocation = reponseData.OrderBy(d => d.Key).Select(d => d.Value);

                    response.data.Clear();
                    foreach (var data in responseDataSortedLocation)
                    {
                        response.data.Add(data as Dictionary<string, object>);
                    }

                    return Json(response);
                }
            }

            catch (Exception ex)
            {
                WebApiApplication.Log.Error("Locations Controller: " + ex);
                return Json(response);
            }
        }

       }
}

