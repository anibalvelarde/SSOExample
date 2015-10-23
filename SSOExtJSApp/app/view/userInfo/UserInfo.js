Ext.define('SSOExtJSApp.view.userInfo.UserInfo', {
    extend: 'Ext.panel.Panel',
    xtype: 'pnl-userInfo',
    bodyPadding: 5,  // Don't want content to crunch against the borders
    width: 300,
    title: 'User Info',
    controller: 'userInfo',
    viewModel: {
        type: 'userInfoViewModel'
    },
    requires: [
        'SSOExtJSApp.view.userInfo.UserInfoController',
        'SSOExtJSApp.view.userInfo.UserInfoModel'
    ],
    items: [{
        xtype     : 'textareafield',
        grow      : true,
        width     : 800,
        height    : 600,
        anchor    : '100%',
        bind: '{userClaims}',
        readOnly: true
    }]
});