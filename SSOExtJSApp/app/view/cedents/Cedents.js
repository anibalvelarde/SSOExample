/**
 * The dashboard's 'Cedents' grid
 */
Ext.define('SSOExtJSApp.view.cedents.Cedents', {
    extend: 'Ext.grid.Panel',
    title: 'Cedents',
    requires: [
        'SSOExtJSApp.view.cedents.CedentsController',
        'SSOExtJSApp.view.cedents.CedentsStore',
        'SSOExtJSApp.view.cedents.CedentsModel'
    ],

    xtype: 'main-cedents',
    controller: 'cedents',
    collapsible: true,
    layout: 'fit',
    flex: 1,
    columns: [
        { text: 'Policy ID', dataIndex: 'PolicyID' },
        { text: 'Policy Name', dataIndex: 'PolicyName' },
        {  text: 'Last Updated By' , dataIndex: 'LastUpdatedBy' }
    ],
    store: {
        type: 'CedentsStore'
    },
    initComponent: function(){
    this.callParent();
    this.on('render', this.loadStore, this);
},
loadStore: function() {
    this.getStore().load();
}
});