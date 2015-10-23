/**
 * This is the proxy class that helps in attaching an access token when calling a restful service. This proxy understands
 * the GSF Security API by default. If you want this proxy to understand your Application's API, specify a config value 'resourceName' in your store's proxy.
 */
Ext.define('Aon.Arbt.Security.Proxy', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.ArbtSecurityWebApiProxy',
    config: {
        /**
         * @cfg {String} [resourceName] name of the restful service as per the registration in GSF.
         */
        resourceName: '',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        timeout: 30000
    },
    buildUrl: function (request) {
        //If no resource name is set in the derived proxy then we assume that the call is for the security api
        //We build the url to call the security api
        if (!(this.config.resourceName != undefined && this.config.resourceName != '')) {
            return Aon.Arbt.Security.retrieveItem(Aon.Arbt.Security.ls_gsfServerApiUrl) + request.getProxy().getUrl();
        }
        return request.getProxy().getUrl();
    },
    doRequest: function (operation, callback, scope) {
        var me = this,
            writer = me.getWriter(),
            request = me.buildRequest(operation),
            headers = Ext.applyIf(me.getHeaders());

        var ls_access_token = 'aal-access-token';
        //Get the resource name from the config of the derived proxy
        var apiName = Aon.Arbt.Security.securityApiName;
        if (this.config.resourceName != undefined && this.config.resourceName != '') {
            apiName = this.config.resourceName;
        }

        //Check for the token in cache
        var access_token = Aon.Arbt.Security.getAccessTokenFromCache(apiName);

        //If token is found and valid, then make a call to the server
        //else go to GSF authorization server to get the access token
        if (Aon.Arbt.Security.isAccessTokenValid(access_token)) {

            //Send the token as part of the header
            headers['Authorization'] = 'Bearer ' + access_token;

            request.setConfig({
                headers: headers,
                timeout: me.getTimeout(),
                method: me.getMethod(request),
                callback: me.createRequestCallback(request, operation, callback, scope),
                scope: me,
                proxy: me
            });

            // We now always have the writer prepare the request
            request = writer.write(request);

            Ext.Ajax.request(request.getCurrentConfig());
            return request;
        }
        else {
            //Remove the access token from cache before getting from GSF
            var key = ls_access_token + '-' + apiName;
            Ext.util.Cookies.set(key, '', null, null, null, true);

            //If token is not valid try to perform the login process again
            Aon.Arbt.Security.getAccessToken(Aon.Arbt.Security.retrieveItem(Aon.Arbt.Security.ls_environment),
                apiName,
                Aon.Arbt.Security.retrieveItem(Aon.Arbt.Security.ls_redirectUrl));
        }
    }
});