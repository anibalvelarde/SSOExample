using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using Swashbuckle.Swagger;

namespace SSOWebApi
{
    /// <summary>
    /// Authentication related response Codes displayed in the Swagger UI go here
    /// </summary>
    public class AddAuthResponseCodes : IOperationFilter
    {
        /// <summary>
        /// Implement the Apply method of IOperation filter to return custom authentication messages in Swagger UI
        /// </summary>
        /// <param name="operation"></param>
        /// <param name="dataTypeRegistry"></param>
        /// <param name="apiDescription"></param>
        public void Apply(Operation operation, DataTypeRegistry dataTypeRegistry, ApiDescription apiDescription)
        {
            if (apiDescription.ActionDescriptor.GetFilters().OfType<AuthorizeAttribute>().Any())
            {
                operation.ResponseMessages.Add(new ResponseMessage
                {
                    Code = (int)HttpStatusCode.Unauthorized,
                    Message = "Authentication required"
                });
            }
        }
    }
}