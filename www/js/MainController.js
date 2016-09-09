angular.module('app').controller('MainController', ['$scope', function($scope) {
  var oneUSDToCADVisa = 1.311769; //uses Visa's exchange rate, assuming Card is a CAD card

  //$scope.checkbox.visa = true;

  $scope.usdToCad = function() {
    var usdInput = $scope.input.usd;
    var result = round(usdInput * oneUSDToCADVisa, 2);
    if (!result) {
      result = null;
    }
    $scope.input.cad = result;
  };

  $scope.cadToUsd = function() {
    var cadInput = $scope.input.cad;
    var result = round(cadInput * 1/oneUSDToCADVisa, 2);
    if (!result) {
      result = null;
    }
    $scope.input.usd = result;
  };

  $scope.resetInputs = function() {
    $scope.input.cad = null;
    $scope.input.usd = null;
  };

  function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }
}]);
