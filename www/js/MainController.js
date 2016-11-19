angular.module('app').controller('MainController', ['$scope', function($scope) {
  $scope.currencies = ["cad", "usd", "jpy", "krw"];
  var oneUSDTo = {
    "cad" : 1.350550,
    "jpy" : 110.877000,
    "krw" : 1181.645000,
    "usd" : 1
  };

  $scope.currenciesModel = {
    "cad" : null,
    "usd" : null,
    "jpy" : null,
    "krw" : null
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
}]);
