angular.module('app')
    .controller('MainController', ['$rootScope', '$scope', '$http', '$ionicLoading', '$ionicPopup', 'localStorageService',
        function ($rootScope, $scope, $http, $ionicLoading, $ionicPopup, localStorageService) {

            $scope.currencies = {
                "AUD": {
                    "show": false,
                    "fullname": "Australian Dollar"
                },
                "BRL": {
                    "show": false,
                    "fullname": "Brazilian Real"
                },
                "CAD": {
                    "show": true,
                    "fullname": "Canadian Dollar"
                },
                "CHF": {
                    "show": false,
                    "fullname": "Swiss Franc"
                },
                "CNY": {
                    "show": true,
                    "fullname": "Chinese Yuan"
                },
                "CZK": {
                    "show": false,
                    "fullname": "Czech Koruna"
                },
                "DKK": {
                    "show": false,
                    "fullname": "Danish Krone"
                },
                "EUR": {
                    "show": true,
                    "fullname": "Euro"
                },
                "GBP": {
                    "show": true,
                    "fullname": "British Pound"
                },
                "HKD": {
                    "show": false,
                    "fullname": "Hong Kong Dollar"
                },
                "HRK": {
                    "show": false,
                    "fullname": "Croatian Kuna"
                },
                "HUF": {
                    "show": false,
                    "fullname": "Hungarian Forint"
                },
                "IDR": {
                    "show": false,
                    "fullname": "Indonesian Rupiah"
                },
                "ILS": {
                    "show": false,
                    "fullname": "Israeli Shekel"
                },
                "INR": {
                    "show": false,
                    "fullname": "Indian Rupee"
                },
                "ISK": {
                    "show": false,
                    "fullname": "Icelandic Krona"
                },
                "JPY": {
                    "show": true,
                    "fullname": "Japanese Yen"
                },
                "KRW": {
                    "show": true,
                    "fullname": "South Korean Won"
                },
                "MXN": {
                    "show": false,
                    "fullname": "Mexican Peso"
                },
                "MYR": {
                    "show": false,
                    "fullname": "Malaysian Ringgit"
                },
                "NOK": {
                    "show": false,
                    "fullname": "Norwegian Krone"
                },
                "NZD": {
                    "show": false,
                    "fullname": "New Zealand Dollar"
                },
                "PHP": {
                    "show": false,
                    "fullname": "Philippine Peso"
                },
                "PLN": {
                    "show": false,
                    "fullname": "Polish Zloty"
                },
                "RON": {
                    "show": false,
                    "fullname": "Romanian New Leu"
                },
                "RUB": {
                    "show": false,
                    "fullname": "Russian Ruble"
                },
                "SEK": {
                    "show": false,
                    "fullname": "Swedish Krona"
                },
                "SGD": {
                    "show": false,
                    "fullname": "Singapore Dollar"
                },
                "THB": {
                    "show": false,
                    "fullname": "Thai Baht"
                },
                "TRY": {
                    "show": false,
                    "fullname": "Turkish Lira"
                },
                "TWD": {
                    "show": false,
                    "fullname": "New Taiwan Dollar"
                },
                "USD": {
                    "show": true,
                    "fullname": "US Dollar"
                },
                "ZAR": {
                    "show": false,
                    "fullname": "South African Rand"
                }
            };

            function createCurrenciesModel() {
                $scope.currenciesModel = {};
                for (var key in $scope.currencies) {
                    $scope.currenciesModel[key] = null;
                }
            }

            $scope.$on('closeSettingsMenu', function() {
                $scope.closeSettingsMenu();
            });

            $scope.valueChange = function (value, currency) {
                if ((value * 100) % 1 !== 0) {
                    $scope.currenciesModel[currency] = ((value * 1000).toFixed(0) - (((value * 1000).toFixed(0)) % 10)) / 1000;
                }
                updateAll(currency);
            };

            var updateAll = function (currencyToNotUpdate) {
                var valueOfCurrency = $scope.currenciesModel[currencyToNotUpdate];
                for (var key in $scope.currenciesModel) {
                    $scope.currenciesModel[key] = roundOrNull(convertCurrency(currencyToNotUpdate, key, valueOfCurrency), 2);
                }
            };

            function convertCurrency(fromCurrency, toCurrency, value) {
                var baseValue = value / $scope.exchangeRates[fromCurrency];
                return baseValue * $scope.exchangeRates[toCurrency];
            }

            $scope.resetInputs = function () {
                for (var key in $scope.currenciesModel) {
                    $scope.currenciesModel[key] = null;
                }
            };

            function roundOrNull(value, decimals) {
                var roundedValue = round(value, decimals);
                return (roundedValue === 0) ? null : roundedValue;
            }

            function round(value, decimals) {
                return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
            }


            /* Loading spinner */
            $scope.show = function () {
                $ionicLoading.show({
                    template: '<ion-spinner icon="dots" class="spinner-light"></ion-spinner>'
                });
            };

            $scope.hide = function () {
                $ionicLoading.hide();
            };


            /***
             * Load from local storage if < 24 hours old, otherwise call exchange rates (api).
             * If fail, use local storage. If doesn't exist, use hardcoded rates
             */
            var getExchangeRates = function () {
                $scope.show($ionicLoading);

                let localStorageData = localStorageService.get('exchangeRates');
                if (localStorageData) {
                    let timestamp = localStorageData.timestamp * 1000;
                    let millisecondsInADay = 24 * 60 * 60 * 1000;
                    if (Date.now() - timestamp < millisecondsInADay) {
                        setExchangeRateVariables(localStorageData);
                        $scope.hide($ionicLoading);
                        return;
                    }
                }

                const sURL = "http://data.fixer.io/api/latest?access_key=" + "5b80344db7aec5d65deb6fedd17ca62e";

                $http.get(sURL,
                    {
                        timeout: 5000
                    }
                ).then(function (response) {
                    let data = response.data;
                    localStorageService.set('exchangeRates', data);
                    setExchangeRateVariables(data);
                    $scope.hide($ionicLoading);
                }, function (err) {
                    $http.get('backupRates.json').then(function(json) {
                        let backupData = json.data;
                        let data = localStorageData && localStorageData.timestamp > backupData.timestamp ? localStorageData : backupData;
                        setExchangeRateVariables(data);
                        $scope.hide($ionicLoading);

                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Failed to get newest rates. Using rates from ' + $scope.exchangeRateLastUpdated.toString()
                        });
                    });
                });
            };

            var setExchangeRateVariables = function(data) {
                $scope.base = data.base;
                $scope.exchangeRates = data.rates;
                $scope.exchangeRateLastUpdated = new Date(data.timestamp * 1000);
            }

            var getCurrenciesToShow = function () {
                var currenciesInStorage = localStorageService.get('currenciesToShow');
                if (currenciesInStorage && Object.keys(currenciesInStorage).length === Object.keys($scope.currencies).length) {
                    const currenciesInStorageArray = Object.values(currenciesInStorage);
                    let numberOfCurrenciesShown = 0;

                    for (let i = 0; i < currenciesInStorageArray.length; i++) {
                        if (currenciesInStorageArray[i].show) {
                            numberOfCurrenciesShown++;
                            if (numberOfCurrenciesShown > 1) {
                                break;
                            }
                        }
                    }

                    if (numberOfCurrenciesShown > 1) {
                        $scope.currencies = currenciesInStorage;
                    } else {
                        $scope.updateCurrenciesToShow();
                    }
                }
            };

            $scope.updateCurrenciesToShow = function () {
                localStorageService.set('currenciesToShow', $scope.currencies);
            };

            getExchangeRates();
            getCurrenciesToShow();
            createCurrenciesModel();
            $rootScope.settingsMenuOpen = false;

            // When settings menu is open on a mobile device, and they tap main-content, it should close the settings menu
            document.getElementById("main-content-styles").addEventListener("click", function () {
                if (getWindowWidth() < 767 && $rootScope.settingsMenuOpen) {
                    $scope.closeSettingsMenu();
                }
            });

            $scope.closeSettingsMenu = function() {
                document.getElementById("settings-side-menu").style.width = "0";
                document.getElementById("main-content-styles").style.width = "100%";
                document.getElementById("settings-icon").classList.remove("menu-open");
                $rootScope.settingsMenuOpen = false;
            }

            $scope.openSettingsMenu = function() {
                if (getWindowWidth() > 767) {
                    document.getElementById("settings-side-menu").style.width = "330px";
                    document.getElementById("main-content-styles").style.width = "calc(100% - 330px)";
                } else {
                    document.getElementById("settings-side-menu").style.width = "300px";
                }
                document.getElementById("settings-icon").classList.add("menu-open");
                $rootScope.settingsMenuOpen = true;
            }
            
            $scope.toggleSettingsMenu = function () {
                if ($rootScope.settingsMenuOpen) {
                    $scope.closeSettingsMenu();
                } else {
                    $scope.openSettingsMenu();
                }
            };

            function getWindowWidth() {
                return window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth;
            }
        }]);
