Ext.define('SSOExtJSApp.view.cedents.CedentsModel', {
    extend: 'Ext.data.Model',
    xtype: 'CedentsModel',
    idProperty: 'CedentID',
    fields: [
       { name: 'PolicyID', type: 'int' },
       { name: 'PolicyName', type: 'string' },
       { name: 'LastUpdatedBy', type: 'string' }
    ]
});
