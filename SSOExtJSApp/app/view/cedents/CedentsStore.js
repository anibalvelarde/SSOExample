Ext.define('SSOExtJSApp.view.cedents.CedentsStore', {
    extend: 'Ext.data.Store',
    xtype: 'cedentsStore',
    alias: 'store.CedentsStore',
    requires: [
        'Ext.data.*',
        'SSOExtJSApp.view.cedents.CedentsModel',
        'SSO.Security.Proxy'
    ],
    model: 'SSOExtJSApp.view.cedents.CedentsModel',
    proxy: {
        type: 'ArbtWebApiProxy',
        //resourceName: 'SSO.Security.ArbtWebApi',
        url: 'https://' + location.hostname  + '/SSO.Security.ArbtWebApi/policy/getPolicy?policyID=100000000',
        useDefaultXhrHeader: false,
        reader: {
            type: 'json'
        }
    }
});
