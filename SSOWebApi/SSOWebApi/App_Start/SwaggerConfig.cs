using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http;
using SSOWebApi;
using SSOWebApi;
using SSOWebApi.Utils;
using Swashbuckle.Application;
using Swashbuckle.Swagger;
using WebActivatorEx;

[assembly: PreApplicationStartMethod(typeof(SwaggerConfig), "Register")]

namespace SSOWebApi
{
    public class SwaggerConfig
    {
        public static void Register()
        {
            Swashbuckle.Bootstrapper.Init(GlobalConfiguration.Configuration);

            // NOTE: If you want to customize the generated swagger or UI, use SwaggerSpecConfig and/or SwaggerUiConfig here ...
            SwaggerSpecConfig.Customize(c =>
            {
                c.IgnoreObsoleteActions();

                c.ApiInfo(new Info
                {
                    Title = "Welcome to SSO Architecture Reference API Interactive Documentation",
                    Description = "Architecture Reference API is a reference for restful service which cater's services to EXTJS and AngularJS Sample application created for TCCC-19.",
                    Contact = "youremail@domain.com"
                });


                c.IncludeXmlComments(GetXmlCommentsPath());

                c.OperationFilter<AddStandardResponseCodes>();
                c.OperationFilter<AddAuthResponseCodes>();
                c.OperationFilter<AddOAuth2Scopes>();

                c.Authorization("oauth2", new Authorization
                {
                    Type = "oauth2",
                    Scopes = new List<Scope>
                        {
                            new Scope { ScopeId = "default", Description = "Use this scope to perform default operations on the API" }
                        },
                    GrantTypes = new GrantTypes
                    {
                        ImplicitGrant = new ImplicitGrant
                        {
                            LoginEndpoint = new LoginEndpoint
                            {
                                Url = Constants.AuthorizationServer.OAuth2AuthorizeEndpoint
                            },
                            TokenName = "access_token"
                        }
                    }
                });
            });

            SwaggerUiConfig.Customize(c =>
            {
                var thisAssembly = typeof(SwaggerConfig).Assembly;
                
                c.SupportHeaderParams = true;
                c.DocExpansion = DocExpansion.List;
                c.SupportedSubmitMethods = new[] { HttpMethod.Get, HttpMethod.Post, HttpMethod.Put, HttpMethod.Head };

                //Inject custom Javascript and Css Style's for Swagger
                c.InjectJavaScript(thisAssembly, "SSOWebApi.SwaggerExtensions.SwaggerScripts.js");
                c.InjectJavaScript(thisAssembly, "SSOWebApi.SwaggerExtensions.SwaggerOAuth.js");
                c.InjectStylesheet(thisAssembly, "SSOWebApi.SwaggerExtensions.SwaggerStyles.css");

                //Enable OAuth on the Swagger UI
                c.EnableOAuth2Support("implicit-SSOWebApi", "SSOWebApi", "SSOWebApi");

            });
        }
        #region Private Methods


        /// <summary>
        /// Get the path for the Xml comments
        /// </summary>
        /// <returns></returns>
        private static string GetXmlCommentsPath()
        {
            return String.Format(@"{0}\SSOWebApi.xml", AppDomain.CurrentDomain.BaseDirectory);
        }

        #endregion
    }
}