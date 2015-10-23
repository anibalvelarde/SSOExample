using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SSOWebApi.Models
{
    public class PolicyViewModel
    {
        public string PolicyID { get; set; }
        public string PolicyName { get; set; }
        public string LastUpdatedBy { get; set; }        
    }
}