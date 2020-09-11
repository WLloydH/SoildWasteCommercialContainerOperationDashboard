using System.Security.Cryptography;

namespace WebApi.Models
{
  
        public class VehicleModel
        {
            public int PK { get; set; }
            public string VehicleNbr { get; set; }
            public int InUse { get; set; }
            public int Available { get; set; }
            public string LoginName { get; set; }
            public string CreateDate { get; set; }
            public string ModifyDate { get; set; }
        }
    }
 



