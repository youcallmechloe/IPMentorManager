/**
 * Created by root on 01/02/2017.
 */
/**
 * Created by root on 01/02/2017.
 */

angular.module('app', ['ngRoute', 'ngResource', 'ngMaterial'])

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

            var loginData = {
                'username' : $scope.username,
                'password' : $scope.password
            };

            $http.post("/users/loginuser", loginData)
                .then(function (response) {
                    console.log(response.data);
                    if(response.data === "true"){
                        alert("change to homepage");
                    } else{
                        alert("Login Failed. Please try again");
                    }
                });

        };

        $scope.createAccount = function(){
            $location.url('/signup');
        };
    }])

    .controller('SignupController', ['$scope', '$location', function($scope, $location) {

        var counter = 0;
        $scope.addNewInterest = function() {
            var divName = 'dynamicInput';
            var newdiv = document.createElement('md-input-container');

            var options = "";
            $.getJSON( '/users/databaseCategories', function( data ) {
                $.each(data, function(index, value){
                    var line = "<option value=\"" + value + "\">" + value + "</option>";
                    options += line;
                });
                console.log(counter);
                newdiv.innerHTML = "<label>Knowledge Area " + counter + " </label> <input type='text' id='interestText"+counter+"'>" +
                    "<select id='interestCategory" + counter + "'>" + options + "</select>";
                console.log(newdiv);
                $('#'+divName).append(newdiv);

                counter++;
            });
        };

        $scope.signup = function(){

        };

        //TODO: doesn't actually work needs to be looked at, think html needs to be moved out of md-input thingys to work?
        function formIsEmpty() {
            console.log('dsfsdf')
            $('#form input').each(function(index, val) {
                if($(this).val() === '') { return false; }
            });
        }

        $scope.goback = function(){
            $location.url('/');
        };
    }])

    //---------------
    // Routes - add in accesses to each url
    //---------------

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/login.html',
                controller: 'LoginController'
            })
            .when('/signup', {
                templateUrl: 'partials/signup.html',
                controller: 'SignupController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);