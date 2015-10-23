/**
 * The dashboard's 'Cedents' grid
 */
Ext.define('SSOExtJSApp.view.securityApi.SecurityApi', {
    extend: 'Ext.grid.Panel',
    title: 'Cedents',
    requires: [
        'SSOExtJSApp.view.securityApi.SecurityApiController',
        'SSOExtJSApp.view.securityApi.SecurityApiStore',
        'SSOExtJSApp.view.securityApi.SecurityApiModel'
    ],

    xtype: 'main-securityApi',
    controller: 'SecurityApi',
    collapsible: true,
    layout: 'fit',
    flex: 1,
    columns: [
        {  text: 'User Registration Data' , dataIndex: 'userRegistrationStatusData' }
    ],
    store: {
        type: 'SecurityApiStore'
    },
    initComponent: function(){
        this.callParent();
        this.on('render', this.loadStore, this);
    },
    loadStore: function() {
        this.getStore().load();
    }
});