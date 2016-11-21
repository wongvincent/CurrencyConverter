angular.module('app').controller('MainController', ['$scope', '$http', '$ionicLoading', function($scope, $http, $ionicLoading) {
  /* To add a new currency, add it to $scope.currencies and oneUSDTo, and $scope.currenciesModel.
  * update oneUSDTo values for all currencies, and update $scope.exchangeRateLastUpdated value */
  $scope.currencies = ["CAD", "USD", "JPY", "KRW"];
  var oneUSDTo = {
    "CAD" : 1.350550,
    "JPY" : 110.877000,
    "KRW" : 1181.645000,
    "USD" : 1
  };

  // month is month-1. yyyy, mm, day, hours, minutes, seconds, milliseconds
  $scope.exchangeRateLastUpdated = new Date(Date.UTC (2016, 10, 19, 12, 0, 0));

  $scope.currenciesModel = {
    "CAD" : null,
    "JPY" : null,
    "KRW" : null,
    "USD" : null
  };

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
        var allRates = data.rates;

        var updatedOneUSDTo = {};
        for (var key in oneUSDTo) {
          var iRate = allRates[key];
          if (iRate) {
            updatedOneUSDTo[key] = iRate;
          } else if (key === "USD") {
            updatedOneUSDTo["USD"] = 1;
          } else {
            return;
          }
        }

        oneUSDTo = updatedOneUSDTo;

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

}]);
