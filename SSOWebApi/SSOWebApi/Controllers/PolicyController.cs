using SSOWebApi.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Thinktecture.IdentityModel.Authorization.WebApi;

namespace SSOWebApi.Controllers
{
    public class PolicyController : ApiController
    {
        /// <summary>
        /// Get the policy using the PolicyID
        /// </summary>
        /// <returns></returns>
        [Route("policy/getpolicy")]
        [Scope("default")]
        [ScopeAuthorize("default")]
        public HttpResponseMessage Get(string policyID)
        {
            System.Collections.Generic.List<PolicyViewModel> policies = new List<PolicyViewModel>();

            policies.Add(new PolicyViewModel(){
                PolicyID = "8AD235C0-C929-4B2C-8D1B-B43F28EE3F96",
                PolicyName = "ACE's Yearly Policy",
                LastUpdatedBy = "Praveen Addepally"
            });

            policies.Add(new PolicyViewModel(){
                PolicyID = "3C667482-0A16-4527-8DBB-1EBBAC33A56B",
                PolicyName = "Best Buy's Yearly Policy",
                LastUpdatedBy = "Praveen Addepally"
            });

            policies.Add(new PolicyViewModel()
            {
                PolicyID = "3659752D-6815-41DB-A80F-6D6F5C31BA78",
                PolicyName = "UHG Yearly Policy",
                LastUpdatedBy = "Praveen Addepally"
            });

            return Request.CreateResponse(policies);
        }
    }
}
