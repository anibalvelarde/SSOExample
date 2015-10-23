using System.Net;
using System.Web.Http.Description;
using Swashbuckle.Swagger;

namespace SSOWebApi
{
    /// <summary>
    /// Standard response codes that show up in the Swagger UI
    /// </summary>
    public class AddStandardResponseCodes : IOperationFilter
    {
        /// <summary>
        /// Implement the Apply method in IOperationFilter to define response codes specific to the API
        /// </summary>
        /// <param name="operation"></param>
        /// <param name="dataTypeRegistry"></param>
        /// <param name="apiDescription"></param>
        public void Apply(Operation operation, DataTypeRegistry dataTypeRegistry, ApiDescription apiDescription)
        {
            operation.ResponseMessages.Add(new ResponseMessage
            {
                Code = (int)HttpStatusCode.OK,
                Message = "It's all good!"
            });

            operation.ResponseMessages.Add(new ResponseMessage
            {
                Code = (int)HttpStatusCode.InternalServerError,
                Message = "Somethings up!"
            });
        }
    }
}