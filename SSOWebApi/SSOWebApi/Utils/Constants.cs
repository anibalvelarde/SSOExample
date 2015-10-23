using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace SSOWebApi.Utils
{
    public class Constants
    {

        /// <summary>
        /// This is the value with which we registered the Security API in the Authorization Server
        /// </summary>
        public const string Application = "SSOWebApi";

        /// <summary>
        /// This is the value with which we registered the Security API in the Authorization Server
        /// </summary>
        public const string Audience = "SSOWebApi";

        /// <summary>
        /// All the constants related to Authorization Server go here
        /// </summary>
        public static class AuthorizationServer
        {
            private static readonly string _serverName = ConfigurationManager.AppSettings["authz:ServerName"];

            /// <summary>
            /// Name of the Issuer
            /// </summary>
            public static string IssuerName = ConfigurationManager.AppSettings["authz:IssuerName"];

            /// <summary>
            /// The Value of the Key with which the JWT is signed by the Authorization Server
            /// This can be found under the Keys section of the Authorization Server Portal
            /// </summary>
            public static string SigningKey = ConfigurationManager.AppSettings["authz:SigningKey"];

            /// <summary>
            /// 
            /// </summary>
            public static string OAuth2TokenEndpoint = _serverName + Application + "/oauth/token";

            /// <summary>
            /// The endpoint which need to be called to get the JWT token's
            /// </summary>
            public static string OAuth2AuthorizeEndpoint = _serverName + Application + "/oauth/authorize";
        }
    }
}