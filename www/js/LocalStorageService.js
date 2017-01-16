angular.module('app').factory('localStorageService', ['$http', function ($http) {
    return {
        set: function (key, value) {
            return localStorage.setItem(key, JSON.stringify(value));
        },
        get: function (key) {
            return JSON.parse(localStorage.getItem(key));
        },
        destroy: function (key) {
            return localStorage.removeItem(key);
        },
    };
}])
