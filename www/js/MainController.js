angular.module('app').controller('MainController', ['$scope', '$http', '$ionicLoading', '$ionicModal', function($scope, $http, $ionicLoading) {

  $scope.currencies = {
    "AUD":{
      "show": false,
      "fullname": "Australian Dollar"
    },
    "BGN":{
      "show": false,
      "fullname": "Bulgarian Lev"
    },
    "BRL":{
      "show": false,
      "fullname": "Brazilian Real"
    },
    "CAD":{
      "show": true,
      "fullname": "Canadian Dollar"
    },
    "CHF":{
      "show": false,
      "fullname": "Swiss Franc"
    },
    "CNY":{
      "show": false,
      "fullname": "Chinese Yuan"
    },
    "CZK":{
      "show": false,
      "fullname": "Czech Koruna"
    },
    "DKK":{
      "show": false,
      "fullname": "Danish Krone"
    },
    "EUR":{
      "show": true,
      "fullname": "Euro"
    },
    "GBP":{
      "show": false,
      "fullname": "British Pound"
    },
    "HKD":{
      "show": false,
      "fullname": "Hong Kong Dollar"
    },
    "HRK":{
      "show": false,
      "fullname": "Croatian Kuna"
    },
    "HUF":{
      "show": false,
      "fullname": "Hungarian Forint"
    },
    "IDR":{
      "show": false,
      "fullname": "Indonesian Rupiah"
    },
    "ILS":{
      "show": false,
      "fullname": "Israeli Shekel"
    },
    "INR":{
      "show": false,
      "fullname": "Indian Rupee"
    },
    "JPY":{
      "show": true,
      "fullname": "Japanese Yen"
    },
    "KRW":{
      "show": true,
      "fullname": "South Korean Won"
    },
    "MXN":{
      "show": false,
      "fullname": "Mexican Peso"
    },
    "MYR":{
      "show": false,
      "fullname": "Malaysian Ringgit"
    },
    "NOK":{
      "show": false,
      "fullname": "Norwegian Krone"
    },
    "NZD":{
      "show": false,
      "fullname": "New Zealand Dollar"
    },
    "PHP":{
      "show": false,
      "fullname": "Philippine Peso"
    },
    "PLN":{
      "show": false,
      "fullname": "Polish Zloty"
    },
    "RON":{
      "show": false,
      "fullname": "Romanian New Leu"
    },
    "RUB":{
      "show": false,
      "fullname": "Russian Ruble"
    },
    "SEK":{
      "show": false,
      "fullname": "Swedish Krona"
    },
    "SGD":{
      "show": false,
      "fullname": "Singapore Dollar"
    },
    "THB":{
      "show": false,
      "fullname": "Thai Baht"
    },
    "TRY":{
      "show": false,
      "fullname": "Turkish Lira"
    },
    "USD":{
      "show": true,
      "fullname": "US Dollar"
    },
    "ZAR":{
      "show": false,
      "fullname": "South African Rand"
    }
  };

  /* *** if update oneUSDTo, please append "USD":1. Also update $scope.exchangeRateLastUpdated. ***
   * oneUSDTo is purposely left out of $scope.currencies object because it makes updating oneUSDTo easier,
   * as it just means copying and pasting the results of the API call.
   * */
  var oneUSDTo = {
    "AUD":1.3525,
    "BGN":1.8401,
    "BRL":3.3916,
    "CAD":1.3515,
    "CHF":1.0077,
    "CNY":6.8827,
    "CZK":25.435,
    "DKK":6.9996,
    "GBP":0.81116,
    "HKD":7.7571,
    "HRK":7.0863,
    "HUF":291.18,
    "IDR":13428.0,
    "ILS":3.8727,
    "INR":67.943,
    "JPY":110.03,
    "KRW":1176.2,
    "MXN":20.413,
    "MYR":4.404,
    "NOK":8.5651,
    "NZD":1.4181,
    "PHP":49.569,
    "PLN":4.18,
    "RON":4.2478,
    "RUB":64.723,
    "SEK":9.2429,
    "SGD":1.4213,
    "THB":35.51,
    "TRY":3.368,
    "USD":1,
    "ZAR":14.375,
    "EUR":0.94082
  };

  // month is month-1. yyyy, mm, day, hours, minutes, seconds, milliseconds
  $scope.exchangeRateLastUpdated = new Date(Date.UTC (2016, 10, 18, 15, 0, 0));

  function createCurrenciesModel() {
    $scope.currenciesModel = {};
    for (var key in $scope.currencies) {
      $scope.currenciesModel[key] = null;
    }
  }

  //$scope.checkbox.visa = true;
  $scope.valueChange = function (currency) {
    updateAll(currency);
  };

  var updateAll = function (currencyToNotUpdate) {
    var valueOfCurrency = $scope.currenciesModel[currencyToNotUpdate];
    for (var key in $scope.currenciesModel) {
      $scope.currenciesModel[key] = roundOrNull(convertCurrency(currencyToNotUpdate, key, valueOfCurrency), 2);
    }
  };

  function convertCurrency (fromCurrency, toCurrency, value) {
    var usdValue = value / oneUSDTo[fromCurrency];
    return usdValue * oneUSDTo[toCurrency];
  }

  $scope.resetInputs = function() {
    for (var key in $scope.currenciesModel) {
      $scope.currenciesModel[key] = null;
    }
  };

  function roundOrNull(value, decimals) {
    var roundedValue = round(value, decimals);
    return (roundedValue === 0) ? null : roundedValue;
  }

  function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }



  /* Loading spinner */

  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="dots" class="spinner-light"></ion-spinner>'
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  };


  /* Load exchange rates (api), otherwise use hardcoded rates */
  $scope.getExchangeRates = function() {
    // Could convert to a service, if our code makes more calls to this API in the future
    if (navigator.onLine) { // this checks if we are connected to a network/router, NOT if the browser can access the internet
      $scope.show($ionicLoading);
      $http.get("https://api.fixer.io/latest?base=USD").then(function (response) {
        var data = response.data;
        oneUSDTo = data.rates;
        oneUSDTo["USD"] = 1;

        var parseDateToUTC = function (dateStr) { //given "yyyy-mm-dd"
          var parts = dateStr.split("-");
          return new Date(Date.UTC(parts[0], parts[1]-1, parts[2], 15));
        };

        //API updates exchange rates at 4pm CET, which is 3pm UTC
        $scope.exchangeRateLastUpdated = parseDateToUTC(data.date);
      }, function (err) {

      }).finally(function ($ionicLoading) {
        // On both cases hide the loading
        $scope.hide($ionicLoading);
      });
    }
  };

  $scope.getExchangeRates();
  createCurrenciesModel();
  $scope.settingsMenuOpen = false;
  document.getElementById("main-content-styles-without-settings").addEventListener("click", function () {
    if (getWindowWidth() < 767 && $scope.settingsMenuOpen) {
      $scope.toggleSettingsMenu();
    }
  });




  /* Settings side menu functions */
  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
  $scope.toggleSettingsMenu = function() {
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
