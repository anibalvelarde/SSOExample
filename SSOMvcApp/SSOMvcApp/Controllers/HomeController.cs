//using SSOMvcApp.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Services;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace SSOMvcApp.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.ClaimsIdentity = Thread.CurrentPrincipal.Identity;
            return View();
        }

        public ActionResult SignedOut()
        {
            return View();
        }
    }
}