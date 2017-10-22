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
                "AUD": 1.2739,
                "BGN": 1.6549,
                "BRL": 3.1747,
                "CAD": 1.2494,
                "CHF": 0.9813,
                "CNY": 6.6185,
                "CZK": 21.738,
                "DKK": 6.2987,
                "GBP": 0.75836,
                "HKD": 7.803,
                "HRK": 6.3518,
                "HUF": 260.73,
                "IDR": 13510.0,
                "ILS": 3.4876,
                "INR": 65.01,
                "JPY": 113.17,
                "KRW": 1130.6,
                "MXN": 18.893,
                "MYR": 4.225,
                "NOK": 7.9662,
                "NZD": 1.4288,
                "PHP": 51.502,
                "PLN": 3.5846,
                "RON": 3.8899,
                "RUB": 57.428,
                "SEK": 8.1609,
                "SGD": 1.3584,
                "THB": 33.16,
                "TRY": 3.663,
                "ZAR": 13.684,
                "EUR": 0.84617
            };

            // month is month-1. yyyy, mm, day, hours, minutes, seconds, milliseconds
            $scope.exchangeRateLastUpdated = new Date(Date.UTC(2017, 9, 20, 15, 0, 0));

            function createCurrenciesModel() {
                $scope.currenciesModel = {};
                for (var key in $scope.currencies) {
                    $scope.currenciesModel[key] = null;
                }
            }

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
                var sURL = "https://api.fixer.io/latest?base=USD&" + Date.now();

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

            // When settings menu is open on a mobile device, and they tap main-content, it should close the settings menu
            document.getElementById("main-content-styles").addEventListener("click", function () {
                if (getWindowWidth() < 767 && $scope.settingsMenuOpen) {
                    $scope.toggleSettingsMenu();
                }
            });

            /* Settings side menu functions */
            /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
            $scope.toggleSettingsMenu = function () {
                if ($scope.settingsMenuOpen) {
                    document.getElementById("settings-side-menu").style.width = "0";
                    document.getElementById("main-content-styles").style.width = "100%";
                    document.getElementById("settings-icon").classList.remove("menu-open");
                    $scope.settingsMenuOpen = false;
                } else {
                    if (getWindowWidth() > 767) {
                        document.getElementById("settings-side-menu").style.width = "330px";
                        document.getElementById("main-content-styles").style.width = "calc(100% - 330px)";
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
