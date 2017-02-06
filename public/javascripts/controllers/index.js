/**
 * Created by root on 01/02/2017.
 */
/**
 * Created by root on 01/02/2017.
 */

angular.module('app', ['ngRoute', 'ngResource', 'ngMaterial', 'ngCookies'])

//---------------
// Services
//---------------
//
    .factory('userPersistence', ['$cookies', function($cookies){
        var userName = "";
        return {
            setCookieData: function(username){
                userName = username;
                $cookies.put("userName", username);
            },
            getCookieData: function() {
                userName = $cookies.get("userName");
                return userName;
            },
            clearCookieData: function() {
                userName = "";
                $cookies.remove("userName");
            }
        }
    }])

    .directive('header', function () {
        return {
            restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
            replace: true,
            scope: {user: '='}, // This is one of the cool things :). Will be explained in post.
            controller: ['$scope', '$filter', 'userPersistence', function ($scope, $filter, userPersistence) {
                // $scope.$on('$routeChangeStart', function (next, current) {
                //     console.log(userPersistence.getCookieData());
                //     $scope.loggedIn = isLoggedIn();
                // });


            }]
        }
    })

    //---------------
    // Controllers
    //---------------

    .controller('HeaderController', ['$scope', 'userPersistence', '$location', function($scope, userPersistence, $location){
        $scope.isLoggedIn = function(){
            if(userPersistence.getCookieData() !== undefined){
                return true;
            } else{
                return false;
            }
        };

        $scope.userLogout = function(){
            var logged = confirm("Do you want to log out?");
            if(logged === true){
                userPersistence.clearCookieData();
                $location.url('/');
            }
        };

    }])

    .controller('LoginController', ['$scope', '$location', '$http', 'userPersistence',
        function ($scope, $location, $http, userPersistence) {

        $scope.login = function() {
            var username = $scope.username;
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var loginData = {
                'username' : username,
                'password' : $scope.password
            };

            $http.post("/users/loginuser", loginData)
                .then(function (response) {
                    console.log(response.data);
                    if(response.data === "true"){
                        userPersistence.setCookieData(username);
                        $location.url('/home')
                    } else{
                        alert("Login Failed. Please try again");
                    }
                });

        };

        $scope.createAccount = function(){
            $location.url('/signup');
        };
    }])

    .controller('SignupController', ['$scope', '$location', '$http', function($scope, $location, $http) {
        var limit = 10;
        var counter = 0;
        $scope.interests = [];

        $scope.addNewInterest = function() {
            var divName = 'dynamicInput';

            if(limit === counter){
                alert("You have reached the limit of adding " + counter + " inputs");
            } else {
                var newdiv = document.createElement('md-input-container');
                newdiv.setAttribute('layout', 'row');
                var options = "<option value=\"Chemistry\">Chemistry</option>";
                $.getJSON('/users/databaseCategories', function (data) {
                    $.each(data, function (index, value) {
                        var line = "<option value=\"" + value + "\">" + value + "</option>";
                        options += line;
                    });
                    console.log(counter);
                    newdiv.innerHTML = "<label>Knowledge</label>" +
                        "<input type='text' id='interestText" + counter + "' class='myform ng-pristine ng-untouched md-input ng-empty ng-invalid ng-invalid-required' placeholder='Knowledge' required>" +
                        "<div class='md-errors-spacer'></div>" +
                        "<select id='interestCategory" + counter + "'>" + options + "</select>";
                    console.log(newdiv);
                    $('#' + divName).append(newdiv);

                    counter++;
                });
            }
        };

        $scope.getOptions = function(){
            var options = [];
            $.getJSON('/users/databaseCategories', function (data) {
                $.each(data, function(index, value){
                    options.push(value);
            })});
            return options;
        };

        $scope.addNew = function(){

            var options = "";

            $.getJSON('/users/databaseCategories', function (data) {
                $.each(data, function (index, value) {
                    var line = "<option value=\"" + value + "\">" + value + "</option>";
                    options += line;
                });

                var elem = {'word' : ''};
                $scope.interests.push(elem);
            });

            console.log($scope.interests);
        };

        $scope.signup = function(){
            var knowledgeList = [];
            for(var i = 0; i < counter; i++){
                var interest = {
                    'category': $('#interestCategory' + i).find(":selected").text(),
                    'word': $('#interestText' + i).val()
                };
                knowledgeList[i] = interest;
            }
            var newUser = {
                'username': $scope.username,
                'email': $scope.email,
                'password': $scope.password,
                'fullname': $scope.fullname,
                'age': $scope.age,
                'gender': $scope.gender,
                'degree': $scope.degree,
                'knowledge' : JSON.stringify(knowledgeList)
            };
            console.log(newUser);

            $http.post("/users/addUser", newUser)
                .then(function (response) {
                    console.log(response.data);
                    if(response.data === 'true'){
                        $location.url('/home');
                    } else{
                        alert('There has been a problem creating your account. Please try again.')
                    }
                });
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

    .controller('HomepageController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {
            // $scope.username = userPersistence.getCookieData();
    }])

    .controller('UserprofileController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {

    }])

    .controller('WorkpartnerController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {

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
            .when('/home', {
                templateUrl: 'partials/homepage.html',
                controller: 'HomepageController'
            })
            .when('/profile', {
                templateUrl: 'partials/userprofile.html',
                controller: 'UserprofileController'
            })
            .when('/partner',{
                templateUrl: 'partials/workpartner.html',
                controller: 'WorkpartnerController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);