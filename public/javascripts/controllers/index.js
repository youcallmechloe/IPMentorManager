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

    //---------------
    // Controllers
    //---------------

    .controller('HeaderController', ['$scope', 'userPersistence', '$location', function($scope, userPersistence, $location){

        $scope.getUsername = function(){
            return userPersistence.getCookieData();
        };

        //TODO: need to change as when user creates account they cant go to create account page as this is stopping it which is wrong
        // $scope.$on('$routeChangeStart', function (next, current) {
        //     console.log(userPersistence.getCookieData());
        //     if(userPersistence.getCookieData() === undefined){
        //         $location.url('/');
        //     }
        // });
        $scope.DashboardClick = function(){
            $location.url('/dashboard');
        };
        $scope.MentoringClick = function(){
            $location.url('/mentor');
        };
        $scope.GroupsClick = function(){
            $location.url('/group');
        };
        $scope.ProfileClick = function(){
            console.log('click');
            $location.url('/profile');
        };

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

        $scope.goHome = function() {
            $location.url('/home');
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

    .controller('SignupController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {
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
            var username = $scope.username;
            var knowledgeList = [];
            for(var i = 0; i < counter; i++){
                var interest = {
                    'category': $('#interestCategory' + i).find(":selected").text(),
                    'word': $('#interestText' + i).val()
                };
                knowledgeList[i] = interest;
            }
            var newUser = {
                'username': username,
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
                        userPersistence.setCookieData(username);
                        console.log(username);
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

    }])

    .controller('UserprofileController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {

    }])

    .controller('WorkpartnerController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {

    }])

    .controller('GroupController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {
        $scope.groups = false;
        $scope.searchList = [];
        $scope.selectedItem = '';

            $scope.creatingGroup = function() {
            $scope.groups = true;
        };

        $scope.cancelGroup = function() {
            $scope.groups = false;
        };

        $scope.createGroup = function() {
            var groupJSON = {
                'groupname' : $scope.groupname,
                'description' : $scope.groupdescription,
                'admin' : userPersistence.getCookieData(),
                'members' : [userPersistence.getCookieData()],
                'posts' : []
            };

            $http.post("/groups/creategroup", groupJSON)
                .then(function(response){
                    if(response.data === 'false'){
                        alert('Sorry, that group name is taken, please choose another one');
                    } else{
                        $scope.groupname = '';
                        $scope.$parent.groupdescription = '';
                       $scope.groups = false;
                    }
                });

        };

        $scope.canJoin = function(groupName){

        };

        $scope.joinGroup = function(groupName){
            var joinJSON = {
                'username' : userPersistence.getCookieData(),
                'groupname' : groupName
            }

            $http.post('/groups/joingroup', joinJSON)
                .then(function(response){
                    console.log(response.data);
            });
        };

        $scope.getGroups = function(searchText) {
            return $http.get('/groups/getgroups/' + searchText)
                .then(function(response){
                return response.data;
            });
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
            .when('/home', {
                templateUrl: 'partials/homepage.html',
                controller: 'HomepageController'
            })
            .when('/profile', {
                templateUrl: 'partials/userprofile.html',
                controller: 'UserprofileController'
            })
            .when('/mentor', {
                templateUrl: 'partials/mentor.html',
                controller: 'WorkpartnerController'
            })
            .when('/group',  {
                templateUrl: 'partials/group.html',
                controller: 'GroupController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);