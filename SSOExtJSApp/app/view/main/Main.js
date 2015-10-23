/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('SSOExtJSApp.view.main.Main', {
    extend: 'Ext.container.Container',
    plugins: 'viewport',
    requires: [
        'Ext.plugin.Viewport',
        'SSOExtJSApp.view.main.MainController',
        'SSOExtJSApp.view.main.MainModel',
        'SSOExtJSApp.view.cedents.Cedents'
    ],

    xtype: 'app-main',

    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'border',
        xtype:Window

    },

    items: [{
        xtype: 'panel',
        bind: {
            title: 'Dashboard'
        },
        region: 'west',
        width: 300,
        split: true,
        items: [{
            xtype: 'button',
            text: 'Logout',
            width: '300',
            scale: 'large',
            handler: 'onClickSLOButton',
            margin: '5 0 0 0'
        }]
    } ,{
        region: 'center',
        xtype: 'tabpanel',
        items:[{
            title: 'User Claims',
            xtype: 'pnl-userInfo'
        },  {
            title: 'Security API',
            xtype: 'main-securityApi'
        }, {
            title: 'Policies',
            xtype: 'main-cedents'
        }]
    }, {
            xtype: 'container',
            id: 'app-header',
            region: 'north',

            height: 52,
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [{
                xtype: 'image',
                id: 'app-header-logo',
                src: 'resources/images/logo.png',
                height: 40
            },{
                xtype: 'component',
                cls: 'app-header-text',
                bind: '{name}',
                flex: 1
            },{
                xtype: 'component',
                id: 'app-header-username',
                cls: 'app-header-text',
                bind: 'Welcome {userName}!',
                margin: '0 10 0 0'
            }]
        }
    ]
});