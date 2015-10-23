
Ext.define('SSOExtJSApp.proxy.base.ArbtWebApiProxy', {
    extend: 'SSO.Security.Proxy',
    alias : 'proxy.ArbtWebApiProxy',
    config: {
        headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json'},
        timeout: 30000,
        resourceName: 'SSO.Security.ArbtWebApi'
    }
});