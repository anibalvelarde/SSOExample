//using System;
//using System.Collections.Generic;
//using System.IdentityModel.Tokens;
//using System.Linq;
//using System.Web;

//namespace SSOMvcApp.Models
//{
//    public class CustomSamlSecurityTokenHandler : SamlSecurityTokenHandler
//    {
//        public CustomSamlSecurityTokenHandler()
//        {

//        }

//        protected override System.Security.Principal.WindowsIdentity CreateWindowsIdentity(string upn)
//        {
//            return base.CreateWindowsIdentity(upn);
//        }

//        public System.Security.Principal.WindowsIdentity GetWindowsIdentity(string upn)
//        {
//            return CreateWindowsIdentity(upn);
//        }
//    }
//}