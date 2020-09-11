using System;

namespace WebApi.Models
{
    public class DashboardManagerModel
    {
        public Guid PK { get; set; }
        public int FK_Vehicle { get; set; }
        public int FK_Operator { get; set; }
        public int FK_Radio { get; set; }
        public int FK_Location { get; set; }
        public string LocationAddress { get; set; }
        public string Status { get; set; }
        public string Note { get; set; }
        public DateTime RouteDate { get; set; }
        public int RouteStopOrder { get; set; }
        public Guid RouteUnique { get; set; }
        public bool RouteStopChangeRefreshed { get; set; }
        public string RollOff { get; set; }	
		public string LoginName { get; set; }
        public string CreateDate { get; set; }
        public string ModifyDate { get; set; }
        public bool Deleted { get; set; }
    }
}



