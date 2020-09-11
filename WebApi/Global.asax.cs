

using System.Web;
using System.Web.Http;
using log4net;
using log4net.Appender;
using log4net.Config;

[assembly:XmlConfigurator]


namespace WebApi
{


    public class WebApiApplication : HttpApplication
    {
        public static ILog Log;
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register); 
            Log = log4net.LogManager.GetLogger(typeof(WebApiApplication));
            Log.Info("SWCCOD Application Started");
        }
        protected void Application_End()
        {
            Log.Info("SWCCOD Application Ended");
        }
 
    }
}
    