using System;

namespace WebApi.Models
{
    public class ActiveRouteVehiclesModel
    {
        public string VehicleNbr { get; set; }
        public string Vehicle_PK { get; set; }
        public string OperatorName { get; set; }
        public string Operator_PK { get; set; }
        public string LocationName { get; set; }
        public string Location_PK { get; set; }
        public string CallSign { get; set; }
        public string Radio_PK { get; set; }
    }
}



