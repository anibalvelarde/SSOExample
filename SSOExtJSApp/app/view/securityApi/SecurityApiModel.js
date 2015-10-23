Ext.define('SSOExtJSApp.view.securityApi.SecurityApiModel', {
    extend: 'Ext.data.Model',
    xtype: 'SecurityApiModel',
    idProperty: 'userRegistrationStatusData',
    fields: [
       { name: 'userRegistrationStatusData', type: 'string' }
    ]
});
