Ext.define('SSOExtJSApp.view.userInfo.UserInfoModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.userInfoViewModel',
    requires:[
        'SSO.Security.Main'
    ],
    data: {
    },
    formulas: {
        userClaims: function(){
            var userClaimsList = SSO.Security.getClaimsByResourceName('SSO.Security.ArbtWebApi');
            var listOfClaims = '';

            for (var key in userClaimsList) {
                var value = userClaimsList[key];

                listOfClaims += key + ':: ' + value + '\n\n';
            }
            return listOfClaims;
        }
    }
});
