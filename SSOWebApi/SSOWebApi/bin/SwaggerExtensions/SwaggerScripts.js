//Below is the JS Code that will run when the Swagger UI is loaded for the first time
$(function () {
    //Set the head title for the page
    document.title = "ARBT Reference Web API";

    //Change the title of the Swagger UI page
    $('a#logo').text('ARBT Ref Web API');
    
    //Hide the API Key text box
    var txtApiKey = document.getElementById('input_apiKey');
    txtApiKey.style.display = 'none';

    //Set the width of the API version's drop down
    var selBaseUrl = document.getElementById('input_baseUrl');
    selBaseUrl.style.minWidth = '600px';
    selBaseUrl.style.width = '100%';
});

//Set the below global variable properly for OAuth to work in Swagger UI
var host = window.location;
var redirectUrl = host.protocol + '//' + host.host + "/Aon.Arbt.Security.ArbtWebApi/SwaggerOAuthCallback.html";

