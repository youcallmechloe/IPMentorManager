/**
 * Created by root on 01/02/2017.
 */
/**
 * Created by root on 01/02/2017.
 */

angular.module('app', ['ngRoute', 'ngResource'])

//---------------
// Services
//---------------
//
//     .factory('Todos', ['$resource', function($resource){
//         return $resource('/todos/:id', null, {
//             'update': { method:'PUT' }
//         });
//     }])

    //---------------
    // Controllers
    //---------------

    .controller('LoginController', ['$scope', '$location', '$http', function ($scope, $location, $http) {

        $scope.login = function() {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            $http.post('/users/loginuser', {
                'username': $scope.username,
                'password': $scope.password
            }, config)
                .success(function (data, status, headers, config) {
                    alert("yes");
                })
                .error(function (data, status, header, config) {
                    alert("no");
                });
        };

        $scope.createAccount = function(){
            $location.url('/signup');
        };
    }])

    .controller('SignupController', ['$scope', function($scope) {
        $scope.signup = function(){
            alert('sldfns');
        };
    }])

    //---------------
    // Routes
    //---------------

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/login.html',
                controller: 'LoginController'
            })
            .when('/signup', {
                templateUrl: '/signup.html',
                controller: 'SignupController'
            });
    }]);