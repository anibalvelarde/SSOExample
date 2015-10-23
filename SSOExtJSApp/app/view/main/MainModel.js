/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('SSOExtJSApp.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        name: 'ARBT - ExtJS App'
    },

    formulas: {
        userName: function(){
            var userClaimsList = SSO.Security.getClaimsByResourceName('SSO.Security.ArbtWebApi');
            return userClaimsList['http://[your schema name]/identity/displayname'];
        }
    }
});