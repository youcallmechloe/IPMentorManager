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



            }]
        }
    })

    //---------------
    // Controllers
    //---------------

    .controller('HeaderController', ['$scope', 'userPersistence', '$location', function($scope, userPersistence, $location){
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
            $scope.menu = [
                {
                    link : '',
                    title: 'Dashboard',
                    icon: 'dashboard'
                },
                {
                    link : '',
                    title: 'Friends',
                    icon: 'group'
                },
                {
                    link : '',
                    title: 'Messages',
                    icon: 'message'
                }
            ];
    }])

    .controller('UserprofileController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {

    }])

    .controller('WorkpartnerController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {

    }])

    .controller('GroupController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {

    }])

    .controller('AppCtrl', ['$scope', '$mdBottomSheet','$mdSidenav', '$mdDialog', function($scope, $mdBottomSheet, $mdSidenav, $mdDialog){
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };
        $scope.menu = [
            {
                link : '',
                title: 'Dashboard',
                icon: 'dashboard'
            },
            {
                link : '',
                title: 'Friends',
                icon: 'group'
            },
            {
                link : '',
                title: 'Messages',
                icon: 'message'
            }
        ];
        $scope.admin = [
            {
                link : '',
                title: 'Trash',
                icon: 'delete'
            },
            {
                link : 'showListBottomSheet($event)',
                title: 'Settings',
                icon: 'settings'
            }
        ];
        $scope.activity = [
            {
                what: 'Brunch this weekend?',
                who: 'Ali Conners',
                when: '3:08PM',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Summer BBQ',
                who: 'to Alex, Scott, Jennifer',
                when: '3:08PM',
                notes: "Wish I could come out but I'm out of town this weekend"
            },
            {
                what: 'Oui Oui',
                who: 'Sandra Adams',
                when: '3:08PM',
                notes: "Do you have Paris recommendations? Have you ever been?"
            },
            {
                what: 'Birthday Gift',
                who: 'Trevor Hansen',
                when: '3:08PM',
                notes: "Have any ideas of what we should get Heidi for her birthday?"
            },
            {
                what: 'Recipe to try',
                who: 'Brian Holt',
                when: '3:08PM',
                notes: "We should eat this: Grapefruit, Squash, Corn, and Tomatillo tacos"
            },
        ];
        $scope.alert = '';
        $scope.showListBottomSheet = function($event) {
            $scope.alert = '';
            $mdBottomSheet.show({
                template: '<md-bottom-sheet class="md-list md-has-header"> <md-subheader>Settings</md-subheader> <md-list> <md-item ng-repeat="item in items"><md-item-content md-ink-ripple flex class="inset"> <a flex aria-label="{{item.name}}" ng-click="listItemClick($index)"> <span class="md-inline-list-icon-label">{{ item.name }}</span> </a></md-item-content> </md-item> </md-list></md-bottom-sheet>',
                controller: 'ListBottomSheetCtrl',
                targetEvent: $event
            }).then(function(clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };

        $scope.showAdd = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> <form name="userForm"> <div layout layout-sm="column"> <md-input-container flex> <label>First Name</label> <input ng-model="user.firstName" placeholder="Placeholder text"> </md-input-container> <md-input-container flex> <label>Last Name</label> <input ng-model="theMax"> </md-input-container> </div> <md-input-container flex> <label>Address</label> <input ng-model="user.address"> </md-input-container> <div layout layout-sm="column"> <md-input-container flex> <label>City</label> <input ng-model="user.city"> </md-input-container> <md-input-container flex> <label>State</label> <input ng-model="user.state"> </md-input-container> <md-input-container flex> <label>Postal Code</label> <input ng-model="user.postalCode"> </md-input-container> </div> <md-input-container flex> <label>Biography</label> <textarea ng-model="user.biography" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> <md-button ng-click="answer(\'useful\')" class="md-primary"> Save </md-button> </div></md-dialog>',
                targetEvent: ev,
            })
                .then(function(answer) {
                    $scope.alert = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
    }])
    .controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {
        $scope.items = [
            { name: 'Share', icon: 'share' },
            { name: 'Upload', icon: 'upload' },
            { name: 'Copy', icon: 'copy' },
            { name: 'Print this page', icon: 'print' },
        ];

        $scope.listItemClick = function($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
        };
    })

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