angular.module('app')
    .controller('MainController', ['$scope', '$http', '$ionicLoading', '$ionicPopup', 'localStorageService',
        function ($scope, $http, $ionicLoading, $ionicPopup, localStorageService) {

            $scope.currencies = {
                "AUD": {
                    "show": false,
                    "fullname": "Australian Dollar"
                },
                "BGN": {
                    "show": false,
                    "fullname": "Bulgarian Lev"
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
                "JPY": {
                    "show": true,
                    "fullname": "Japanese Yen"
                },
                "KRW": {
                    "show": false,
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
                "USD": {
                    "show": true,
                    "fullname": "US Dollar"
                },
                "ZAR": {
                    "show": false,
                    "fullname": "South African Rand"
                }
            };

            /* *** if updating hard coded exchange rates
             *  1. update $scope.exchangeRateLastUpdated
             * Note: oneUSDTo is purposely left out of $scope.currencies object because it makes updating oneUSDTo easier,
             * as it just means copying and pasting the results of the API call.
             * */
            var oneUSDTo = {
                "AUD": 1.3343,
                "BGN": 1.8345,
                "BRL": 3.1983,
                "CAD": 1.3141,
                "CHF": 1.0063,
                "CNY": 6.9003,
                "CZK": 25.346,
                "DKK": 6.974,
                "GBP": 0.8212,
                "HKD": 7.7546,
                "HRK": 7.0603,
                "HUF": 288.43,
                "IDR": 13332.0,
                "ILS": 3.8149,
                "INR": 68.162,
                "JPY": 114.35,
                "KRW": 1173.8,
                "MXN": 21.655,
                "MYR": 4.462,
                "NOK": 8.4964,
                "NZD": 1.4025,
                "PHP": 49.678,
                "PLN": 4.1027,
                "RON": 4.2137,
                "RUB": 59.345,
                "SEK": 8.8993,
                "SGD": 1.4263,
                "THB": 35.4,
                "TRY": 3.7883,
                "ZAR": 13.515,
                "EUR": 0.938
            };

            // month is month-1. yyyy, mm, day, hours, minutes, seconds, milliseconds
            $scope.exchangeRateLastUpdated = new Date(Date.UTC(2017, 0, 13, 15, 0, 0));

            function createCurrenciesModel() {
                $scope.currenciesModel = {};
                for (var key in $scope.currencies) {
                    $scope.currenciesModel[key] = null;
                }
            }

            $scope.valueChange = function (currency) {
                updateAll(currency);
            };

            var updateAll = function (currencyToNotUpdate) {
                var valueOfCurrency = $scope.currenciesModel[currencyToNotUpdate];
                for (var key in $scope.currenciesModel) {
                    $scope.currenciesModel[key] = roundOrNull(convertCurrency(currencyToNotUpdate, key, valueOfCurrency), 2);
                }
            };

            function convertCurrency(fromCurrency, toCurrency, value) {
                var usdValue = value / oneUSDTo[fromCurrency];
                return usdValue * oneUSDTo[toCurrency];
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


            /* Load exchange rates (api), otherwise use hardcoded rates */
            $scope.getExchangeRates = function () {
                // Should convert this to a service
                $scope.show($ionicLoading);

                // the new Date means a new query string is always created, which prevents caching of the exchange rates
                var sURL = "https://api.fixer.io/latest?base=USD&" + new Date().getTime();

                $http.get(sURL, {timeout: 5000}).then(function (response) {
                    var data = response.data;
                    oneUSDTo = data.rates;

                    var parseDateToUTC = function (dateStr) { //given "yyyy-mm-dd"
                        var parts = dateStr.split("-");
                        return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 15));
                    };

                    //API updates exchange rates at 4pm CET, which is 3pm UTC
                    $scope.exchangeRateLastUpdated = parseDateToUTC(data.date);
                }, function (err) {
                    $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Failed to get newest rates. Using rates from ' + $scope.exchangeRateLastUpdated
                    });
                }).finally(function ($ionicLoading) {
                    // On both cases hide the loading
                    oneUSDTo["USD"] = 1; //add USD to exchange rates (regardless if it's online/offline)
                    $scope.hide($ionicLoading);
                });

            };

            var setCurrenciesToShow = function () {
                var currenciesInStorage = localStorageService.get('currencies');
                if (currenciesInStorage) {
                    $scope.currencies = currenciesInStorage;
                }
            };

            $scope.updateCurrenciesToShow = function () {
                localStorageService.set('currencies', $scope.currencies);
            };

            $scope.getExchangeRates();
            setCurrenciesToShow();
            createCurrenciesModel();
            $scope.settingsMenuOpen = false;
            document.getElementById("main-content-styles-without-settings").addEventListener("click", function () {
                if (getWindowWidth() < 767 && $scope.settingsMenuOpen) {
                    $scope.toggleSettingsMenu();
                }
            });


            /* Settings side menu functions */
            /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
            $scope.toggleSettingsMenu = function () {
                if ($scope.settingsMenuOpen) {
                    document.getElementById("settings-side-menu").style.width = "0";
                    document.getElementById("main-content-styles").style.marginRight = "0";
                    document.getElementById("settings-icon").classList.remove("menu-open");
                    $scope.settingsMenuOpen = false;
                } else {
                    if (getWindowWidth() > 767) {
                        document.getElementById("settings-side-menu").style.width = "330px";
                        document.getElementById("main-content-styles").style.marginRight = "330px";
                    } else {
                        document.getElementById("settings-side-menu").style.width = "300px";
                    }
                    document.getElementById("settings-icon").classList.add("menu-open");
                    $scope.settingsMenuOpen = true;
                }
            };

            function getWindowWidth() {
                return window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth;
            }
        }]);
