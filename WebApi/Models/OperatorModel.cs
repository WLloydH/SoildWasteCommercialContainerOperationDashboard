using System;

namespace WebApi.Models
{
    public class OperatorModel
    {
        public int PK { get; set; }
        public int FK_Vehicle { get; set; }
        public int FK_Radio { get; set; }
        public string OperatorName { get; set; }
        public string LoginName { get; set; }
        public string CreateDate { get; set; }
        public string ModifyDate { get; set; }
    }
}



