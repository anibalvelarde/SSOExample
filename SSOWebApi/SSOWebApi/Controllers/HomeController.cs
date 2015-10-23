using System.Web.Mvc;

namespace SSOWebApi.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            //Redirect to the Swagger Documentation page
            return Redirect(Request.Url.Scheme + "://" + Request.Url.Host + "/SSOWebApi/swagger");
        }
    }
}
