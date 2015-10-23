using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using SSOWebApi.Utils;
using Thinktecture.IdentityModel.Tokens;
using Thinktecture.IdentityModel.Tokens.Http;

namespace SSOWebApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            //Enable Cross-Origin Requests            
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);

            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            //Secure the Web API using Thinktecture Authorization Server (OAuth 2.0)
            config.MessageHandlers.Add(
                new AuthenticationHandler(CreateAuthenticationConfiguration()));
        }

        #region Private Methods

        /// <summary>
        /// Configuration related to the Thinktecture Authorization Server
        /// </summary>
        /// <returns></returns>
        private static AuthenticationConfiguration CreateAuthenticationConfiguration()
        {
            /*ClaimsAuthenticationManager = new GridsClaimsAuthenticationManager(),*/
                
            var authentication = new AuthenticationConfiguration
            {
                RequireSsl = false,
            };

            authentication.AddJsonWebToken(
                
                issuer: Constants.AuthorizationServer.IssuerName,
                audience: Constants.Audience,
                signingKey: Constants.AuthorizationServer.SigningKey,
                claimMappings: ClaimMappings.None);

            return authentication;
        }

        #endregion
    }
}
