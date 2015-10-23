/**
 * This is the main class that can help you with Single Sign On and Single Log Out
 * functionalities provided by Global Security Framework
 * As per the guidelines in the following link, changed the storage of JWT tokens and other information regarding environment, 
 * Redirect URL, Resource List, Authz server URL, GSF API URL, Self Service Site URL to cookies. 
 * https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage/ 
 */
Ext.define('Aon.Arbt.Security.Main', {

        singleton : true,

        //GSF server urls
        gsfWebServerUrl_POC: 'https://dev.app.americas.grids.aonnet.aon.net/',
        gsfWebServerUrl_Dev: 'https://devgsf.arbt.aonnet.aon.net/',
        gsfWebServerUrl_QA: 'https://qagsft.arbt.aon.com/',
        gsfWebServerUrl_PROD: 'https://gsft.arbt.aon.com/',

        //GSF endpoints on different components
        authzEndpointUrl: '/oauth/authorize',
        authzSignOutUrl: '/SingleSignOut',

        //GSF Application Names
        authzServerName: 'AuthorizationServer',
        securityApiName: 'Aon.Arbt.Security.WebApi',
        selfServiceSiteName: 'Aon.Arbt.Security.SelfServiceWebsite',

        //cache related keys
        ls_environment : 'aal-environment',
        ls_redirectUrl : 'aal-redirectUrl',
        ls_resourceList : 'aal-resourceList',
        ls_authzServerUrl: 'aal-authzServerUrl',
        ls_gsfServerApiUrl: 'aal-gsfServerApiUrl',
        ls_gsfSelfServiceUrl: 'aal-gsfSelfServiceUrl',
        ls_isAuthenticated : 'aal-is-authenticated',
        ls_access_token : 'aal-access-token',

        //claim types
        ct_issuer : 'iss',
        ct_audience : 'aud',
        ct_notbefore : 'nbf',
        ct_expiry : 'exp',

        window: null,

        /**
         * Performs a single sign on operation using the different components of the GSF framework
         * @param {Boolean} [environment] Type of the GSF environment under which the SSO must happen.
         * Valid values can be POC, DEV, QA, PROD
         * @param {String} [resources] Specify the list of  names of the restful service names for which you need access token.
         * These restful service names must be registered in GSF
         * @param {String} [redirectUri] Specify the url for which the access token must be sent.
         * This url must also be registered in GSF
         * @return {String} Stores the access token in the cache after successful login
         */
        login: function(environment, resources, redirectUri) {

            //Check if environment is valid
            if (!environment) {
                Ext.Msg.alert('Error', 'Please set the correct security environment you want to connect to. Valid values are POC, Dev, QA, Prod.');
                return false;
            }
            else {
                if(!(environment == 'POC' || environment == 'Dev' || environment == 'QA' || environment == 'Prod')) {
                    Ext.Msg.alert('Error', 'Please set the correct security environment you want to connect to. Valid values are POC, Dev, QA, Prod.');
                    return false;
                }
            }

            redirectUri = redirectUri.toLowerCase();

            //store all the variables needed to process the authentication logic
            this.setupEnvironment(environment, resources, redirectUri);

            //Get the access tokens for all the requested resources
            for( i=0; i< resources.length; i++) {
                this.getAccessToken(environment, resources[i], redirectUri);
            }

            //Check if all the access tokens exist in cache for the requested resources
            var isAuthenticated = true;
            for( i=0; i< resources.length; i++) {
                var lsKey = this.ls_access_token + '-' + resources[i];

                var tokenForCurrentResource = Ext.util.Cookies.get(lsKey);

                if(!tokenForCurrentResource || !this.isAccessTokenValid(tokenForCurrentResource)) {
                    isAuthenticated = false;
                    break;
                }
            }

            this.storeItem(this.ls_isAuthenticated, isAuthenticated);

            //Remove the querystring from the url to make the url clean
            if(isAuthenticated == true) {
                var uri = window.location.toString();
                if (uri.indexOf("#") > 0) {
                    var clean_uri = uri.substring(0, uri.indexOf("#"));
                    window.history.replaceState({}, document.title, clean_uri);
                }
            }
        },
        getAccessToken: function (environment, resourceName, redirectUri) {

            var lsKey = this.ls_access_token + '-' + resourceName;
            var tokenForCurrentResource = Ext.util.Cookies.get(lsKey);
            var access_token = Ext.util.Cookies.get(lsKey);

            //if Access token is not valid request a new one
            if (!this.isAccessTokenValid(this.getAccessTokenFromCache(resourceName))) {
                //check in query string
                var params = {},
                    queryString = window.location.hash.substring(1),
                    regex = /([^&=]+)=([^&]*)/g,m;

                while (m = regex.exec(queryString)) {
                    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                }

                if (params.error) {
                    Ext.Msg.alert('Error', "An error has occurred during the authentication process: " + params.error);
                }
                var token = params.access_token;
                if (token) {

                    var claimsInToken = this.getClaimsByToken(token);

                    //If the access token found in query string is for the current resource
                    //then store the access token in the cache
                    //if not, go to authz server and get the token
                    if(claimsInToken[this.ct_audience] == resourceName) {
                        Ext.util.Cookies.set(lsKey, token, null, null, null, true);
                    }
                    else {
                        this.retrieveTokenFromAuthzServer(environment, resourceName, redirectUri);
                    }
                }
                else {
                    this.retrieveTokenFromAuthzServer(environment, resourceName, redirectUri);
                }
            }
            else {
                this.retrieveTokenFromAuthzServer(environment, resourceName, redirectUri);
            }
        },
        retrieveTokenFromAuthzServer: function (environment, resourceName, redirectUri) {

            if (!this.isAccessTokenValid(this.getAccessTokenFromCache(resourceName))) {

                //Remove the token from storage before going to get new token
                var key = this.ls_access_token + '-' + resourceName;
                Ext.util.Cookies.clear(key);

                //If access-token is in the cache, then do not open the window to perform authentication process
                this.redirectToAuthWindow(this.buildAuthUrl(resourceName, redirectUri));
            }
        },
        /**
         * Logs the user out of all the applications that he/she has accessed during his SSO session
         */
        logout: function () {
            //clear the cache
            this.clearCache();

            //Perform signout from authorization Server
            var signOutUrl = this.retrieveItem(this.ls_authzServerUrl) + this.authzSignOutUrl;

            //Remove the remaining keys
            Ext.util.Cookies.clear(this.ls_isAuthenticated);
            Ext.util.Cookies.clear(this.ls_authzServerUrl);

            //Perform single logout
            window.location.assign(signOutUrl);
        },
        setupEnvironment: function (environment, resources, redirectUri) {
            //Urls of dif. GSF components across dif. environments
            if (environment == 'POC') {
                this.storeItem([this.ls_authzServerUrl], this.gsfWebServerUrl_POC + this.authzServerName);
                this.storeItem([this.ls_gsfServerApiUrl], this.gsfWebServerUrl_POC + this.securityApiName + '/');
                this.storeItem([this.ls_gsfSelfServiceUrl], this.gsfWebServerUrl_POC + this.selfServiceSiteName + '/');
            }

            if (environment == 'Dev') {
                this.storeItem([this.ls_authzServerUrl], this.gsfWebServerUrl_Dev + this.authzServerName);
                this.storeItem([this.ls_gsfServerApiUrl], this.gsfWebServerUrl_Dev + this.securityApiName + '/');
                this.storeItem([this.ls_gsfSelfServiceUrl], this.gsfWebServerUrl_Dev + this.selfServiceSiteName + '/');
            }

            if (environment == 'QA') {
                this.storeItem([this.ls_authzServerUrl], this.gsfWebServerUrl_QA + this.authzServerName);
                this.storeItem([this.ls_gsfServerApiUrl], this.gsfWebServerUrl_QA + this.securityApiName + '/');
                this.storeItem([this.ls_gsfSelfServiceUrl], this.gsfWebServerUrl_QA + this.selfServiceSiteName + '/');
            }

            if (environment == 'Prod') {
                this.storeItem([this.ls_authzServerUrl], this.gsfWebServerUrl_PROD + this.authzServerName);
                this.storeItem([this.ls_gsfServerApiUrl], this.gsfWebServerUrl_PROD + this.securityApiName + '/');
                this.storeItem([this.ls_gsfSelfServiceUrl], this.gsfWebServerUrl_PROD + this.selfServiceSiteName + '/');
            }

            //Store environment, resources and redirectUrl in cache
            this.storeItem([this.ls_environment], environment);
            this.storeItem([this.ls_resourceList], resources);
            this.storeItem([this.ls_redirectUrl], redirectUri);

            //during the setup mark the status of the user as not authenticated
            this.storeItem([this.ls_isAuthenticated], false);
        },
        buildAuthUrl : function (apiName, redirectUri) {

            var authUrl = this.retrieveItem(this.ls_authzServerUrl) + '/' + apiName + this.authzEndpointUrl;

            authUrl = Ext.urlAppend(authUrl, Ext.Object.toQueryString({
                client_id: encodeURI('implicit' + '-' + apiName),
                redirect_uri: encodeURI(redirectUri),
                response_type: encodeURI('token'),
                scope: encodeURI('default'),
                state: encodeURI(Date.now() + "" + Math.random())
            }));

            return  authUrl;
        },
        redirectToAuthWindow : function(url) {
            window.location.assign(url);
        },
        openAuthWindow : function (url) {
            this.window = window.open(url, '_blank', 'location=no');
        },
        clearCache : function() {
            //Remove all the access token for all the resources
            var resourceList = this.retrieveItem(this.ls_resourceList);
            var arResourceList = resourceList.split(",");
            
            //Remove JWT tokens
            for(i=0; i < arResourceList.length; i++) {
                var key = this.ls_access_token + '-' + arResourceList[i];
                Ext.util.Cookies.set(key, '', null, null, null, true);
            }
            
            //Remove configuration keys
            this.storeItem(this.ls_environment, '');
            this.storeItem(this.ls_redirectUrl, '');
            this.storeItem(this.ls_resourceList, '');
            this.storeItem(this.ls_gsfServerApiUrl, '');
            this.storeItem(this.ls_gsfSelfServiceUrl, '');
        },
        getAccessTokenFromCache : function(resourceName) {
            return Ext.util.Cookies.get(this.ls_access_token + '-' + resourceName);
        },
        isAccessTokenValid : function(accessToken) {

            //check if accessToken has a valid value
            if(accessToken) {

                var claims = this.getClaimsByToken(accessToken);

                var nbf = claims[this.ct_notbefore];
                var exp = claims[this.ct_expiry];

                var issuedAt = new Date(nbf * 1000);
                var expiresAt = new Date(exp * 1000);
                var now = new Date();

                var issuedTime = issuedAt.getTime();
                var expiryTime = expiresAt.getTime();
                var currentTime = now.getTime();

                var isIssueGood =  currentTime - issuedTime;
                var isExpiryGood = expiryTime - currentTime;

                // check iat
                if (issuedAt) {
                    if (isIssueGood < 0) {
                        return false;
                    }
                }
                else {
                    return false;
                }

                // check exp expiration
                if (expiresAt) {
                    if (isExpiryGood < 0) {
                        return false;
                    }
                }
                else {
                    return false;
                }

                return true;
            }

            return false;
        },
        //Retrieves an item from cache by decoding it
        retrieveItem : function(key) {
            return window.atob(Ext.util.Cookies.get(key));
        },
        //Stores an item from cache by encoding it
        storeItem : function(key, value) {
            Ext.util.Cookies.set(key, window.btoa(value), null, null, null, true);
        },
        /**
         * Returns the list of claims that are in an access token
         * @param {String} [resourceName] The name of the restful service as per the registration in GSF
         */
        getClaimsByResourceName : function(resourceName) {
            var token = Ext.util.Cookies.get(this.ls_access_token + '-' + resourceName);
            var strToken = new String(token);

            return this.getClaimsByToken(strToken);
        },
        getClaimsByToken: function (accessToken) {
            if(accessToken !== null) {
                var tokenParts = accessToken.split(".");
                if (!tokenParts instanceof Array || tokenParts.length !== 3) {
                    Ext.Msg.alert('Error', 'Invalid access token. Token must have 3 parts: Header, Payload and Signature');
                }
                var tokenHeader = tokenParts[0];
                var tokenPayLoad = tokenParts[1];
                var tokenSignature = tokenParts[2];

                //decode the pay load
                var decodedPayLoad = JSON.parse(decodeURIComponent(escape(window.atob(tokenPayLoad))));

                //return the token pay load
                return decodedPayLoad;
            }
            //no token found
            return '';
        },
        /**
         * Returns true if the user is authenticated
         * Otherwise returns false
         * @return {Boolean} true if authenticated else false
         */
        isUserAuthenticated : function() {
            var isUserAuthenticated = this.retrieveItem(this.ls_isAuthenticated);

            if(isUserAuthenticated) {
                return isUserAuthenticated;
            }

            return false;
        },
        /**
         * Returns the url of the GSF Self Service Site
         * @return {String} Self Service Site Url
         */
        getSelfServiceUrl: function () {
            return this.retrieveItem(this.ls_gsfSelfServiceUrl);
        }
    }
    , function () {
        //for simplicity, create a shorter alias
        Aon.Arbt.Security = this;
    }
);