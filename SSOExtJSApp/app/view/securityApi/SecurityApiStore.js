Ext.define('SSOExtJSApp.view.securityApi.SecurityApiStore', {
    extend: 'Ext.data.Store',
    xtype: 'securityApiStore',
    alias: 'store.SecurityApiStore',
    requires: [
        'Ext.data.*',
        'SSOExtJSApp.view.securityApi.SecurityApiModel',
        'SSO.Security.Proxy'
    ],
    model: 'SSOExtJSApp.view.securityApi.SecurityApiModel',
    proxy: {
        type: 'ArbtSecurityWebApiProxy',
        url:  'security/v0.1/userRegistry/IsUserAlreadyRegistered?arbtSecurityID=6E066AE3-BD62-402C-9F03-A0D835DF2557',
        useDefaultXhrHeader: false,
        reader: {
            type: 'json'
        }
    }
});
