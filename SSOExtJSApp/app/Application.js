/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('SSOExtJSApp.Application', {
    extend: 'Ext.app.Application',
    name: 'SSOExtJSApp',
    requires: [
        'SSO.Security.Main'
    ],
    stores: [
        'SSOExtJSApp.view.cedents.CedentsStore'
    ],
    views: [
        'SSOExtJSApp.view.main.Main'
    ],
    config: {
        securityEnvironment: 'Dev',
        resourceList: ['SSOWebApi'],
        redirectUri: 'https://' + location.hostname + '/SSOExtJSApp'
    },
    launch: function () {
        //Perform the authentication for the application
        SSO.Security.login(this.config.securityEnvironment,
                                this.config.resourceList,
                                this.config.redirectUri);

        // Show the main view in the viewport only if the user is authenticated
        if (SSO.Security.isUserAuthenticated() == 'true') {
            Ext.widget('app-main');
        }
    }
});
