// Ionic Starter App
angular.module('app', ['ionic'])

    .run(['$ionicPlatform' ,function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $ionicPlatform.registerBackButtonAction(function(e) {
            if ($rootscope.settingsMenuOpen) {
                $rootScope.$broadcast('closeSettingsMenu');
                e.preventDefault();
                return false;
            }
            /*
                var exitAppPopup = $ionicPopup.confirm({
                template: 'Exit Currency Converter?',
                cancelText: 'CANCEL',
                cancelType: 'button-light',
                okText: 'EXIT',
                okType: 'button-light',
                });
                exitAppPopup.then(function(res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
                });
            */
        }, 100);
    }]);
