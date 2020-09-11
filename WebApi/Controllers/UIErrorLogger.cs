
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
    public class UIErrorLoggerController : ApiController
    {
        [Route("api/UIErrorLogger")]
        [HttpPost]
        public IHttpActionResult UIErrorLogger()
        {

            WebApiApplication.Log.Info("Enter UIErrorLoggerController");
            var request = HttpContext.Current.Request;
            var settings = Properties.Settings.Default;
           
            try
            {
                int errorMsgIndex=0;
                WebApiApplication.Log.Error(request.Form[errorMsgIndex]);
            }
            catch (Exception ex)
            {
                
                WebApiApplication.Log.Error(ex);
            }
            DtResponse response = new DtResponse();
            return Json(response.data = null);
        }
    }
}


