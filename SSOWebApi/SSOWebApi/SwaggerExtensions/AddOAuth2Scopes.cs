using Swashbuckle.Swagger;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Description;

namespace SSOWebApi
{
    /// <summary>
    /// 
    /// </summary>
    public class AddOAuth2Scopes : IOperationFilter
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="operation"></param>
        /// <param name="dataTypeRegistry"></param>
        /// <param name="apiDescription"></param>
        public void Apply(Operation operation, DataTypeRegistry dataTypeRegistry, ApiDescription apiDescription)
        {


            var scopeIds = apiDescription.ActionDescriptor.GetFilterPipeline()
                .Select(filterInfo => filterInfo.Instance)
                .OfType<ScopeAuthorizeAttribute>()
                .SelectMany(attr => attr.Scopes)
                .Distinct();

            if (scopeIds.Any())
            {
                operation.Authorizations = new Dictionary<string, IList<Scope>>();
                operation.Authorizations["oauth2"] = scopeIds
                    .Select(id => new Scope { ScopeId = id })
                    .ToList();
            }
        }
    }

    /// <summary>
    /// 
    /// </summary>
    public class ScopeAuthorizeAttribute : AuthorizeAttribute
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="scopes"></param>
        public ScopeAuthorizeAttribute(params string[] scopes)
        {
            Scopes = scopes;
        }

        /// <summary>
        /// List of all valid scopes for the API
        /// </summary>
        public string[] Scopes { get; private set; }

        /// <summary>
        /// Returns true or false depending on the scopes the user has
        /// This method is used by the Swagger UI
        /// </summary>
        /// <param name="actionContext"></param>
        /// <returns></returns>
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            // TODO: Parse scopes out of access_token
            return true;
        }
    }
}