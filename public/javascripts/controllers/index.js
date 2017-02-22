/**
 * Created by root on 01/02/2017.
 */
/**
 * Created by root on 01/02/2017.
 */

angular.module('app', ['ngRoute', 'ngResource', 'ngMaterial', 'ngCookies', 'ngMdIcons'])

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

    .directive("listValidator", function() {
        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attributes, ngModel) {
                var list = scope.$eval(attributes.listValidator);
                ngModel.$validators.listValidator = function(modelValue, viewValue) {
                    return list.indexOf(viewValue) !== -1;
                }
            },
        };
    })

    //---------------
    // Controllers
    //---------------

    .controller('HeaderController', ['$scope', 'userPersistence', '$location', function($scope, userPersistence, $location){

        $scope.getUsername = function(){
            return userPersistence.getCookieData();
        };

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

        if(userPersistence.getCookieData() !== undefined){
            $location.url('/home');
        }

            $scope.login = function () {
                var username = $scope.username;
                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };

                var loginData = {
                    'username': username,
                    'password': $scope.password
                };

                $http.post("/users/loginuser", loginData)
                    .then(function (response) {
                        console.log(response.data);
                        if (response.data === "true") {
                            userPersistence.setCookieData(username);
                            $location.url('/home')
                        } else {
                            alert("Login Failed. Please try again");
                        }
                    });

            };

            $scope.createAccount = function () {
                $location.url('/signup');
            };

    }])

    .controller('SignupController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {

        $scope.GenderRadio = "Female";

            if(userPersistence.getCookieData() !== undefined){
                $location.url('/home');
            }
                var limit = 10;
                var counter = 1;
                $scope.categoryList = ['Accounting and Finance', 'Anthropology', 'Archaeology', 'Art', 'Astronomy', 'Biochemistry', 'Biology',
                    'Business', 'Chemistry', 'Computer Science', 'Criminology', 'Ecology', 'Economics', 'Education Studies', 'Engineering',
                    'English', 'Environmental Science', 'Fashion', 'Film', 'French', 'Geography', 'Geology', 'Geophysics',
                    'German', 'History', 'Information Technology', 'Language', 'Law', 'Management', 'Marketing', 'Mathematical Sciences',
                    'Medicine', 'Midwifery', 'Music', 'Natural Sciences', 'Nursing', 'Oceanography', 'Pharmacology', 'Philosophy',
                    'Physics', 'Physiotherapy', 'Politics and International Relations', 'Psychology', 'Ship Science', 'Sociology',
                    'Spanish', 'Zoology', 'Other'];
                $scope.interests = [{
                    word : '',
                    category : ''
                }];

                $scope.addNew = function(){
                    if(counter !== limit) {
                        $scope.interests.push({word: '', category: ''});
                        counter++;
                    } else{
                        alert("You've reached the limit on interest fields!")
                    }
                };

                $scope.removeInterest = function(item){
                    for(var i = 0; i < $scope.interests.length; i++){
                        if(($scope.interests[i].word === item.word) && ($scope.interests[i].category === item.category)){
                            $scope.interests.splice(i, 1);
                        }
                    }
                };

                $scope.getCategory = function(search){
                    var newList = [];
                    if(search !== '') {
                        for(var i = 0; i < $scope.categoryList.length; i++){
                            console.log($scope.categoryList[i]);
                            console.log(search);
                            if($scope.categoryList[i].indexOf(search) !== -1){
                                newList.push($scope.categoryList[i]);
                            }
                        }

                        return newList;
                    }
                };

                $scope.getOptions = function () {
                    var options = [];
                    $.getJSON('/users/databaseCategories', function (data) {
                        $.each(data, function (index, value) {
                            options.push(value);
                        })
                    });
                    return options;
                };

                var checkUserName = function(name){

                }

                $scope.signup = function () {
                    var username = $scope.username;
                    var knowledgeList = [];
                    for (var i = 0; i < counter; i++) {
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
                        'gender': $scope.GenderRadio,
                        'degree': $scope.degree,
                        'degreetitle' : $scope.degreetitle,
                        'knowledge': JSON.stringify($scope.interests)
                    };

                    console.log(username);
                    $http.post("/users/checkusername", {'username' : name})
                        .then(function(response){
                            var bool = response.data;

                            if(bool) {
                                $http.post("/users/addUser", newUser)
                                    .then(function (response) {
                                        console.log(response.data);
                                        if (response.data === 'true') {
                                            userPersistence.setCookieData(username);
                                            console.log(username);
                                            $location.url('/home');
                                        } else {
                                            alert('There has been a problem creating your account. Please try again.')
                                        }
                                    });
                            } else{
                                alert('Username taken, please choose another');
                            }
                        });
                };

                //TODO: doesn't actually work needs to be looked at, think html needs to be moved out of md-input thingys to work?
                function formIsEmpty() {
                    console.log('dsfsdf')
                    $('#form input').each(function (index, val) {
                        if ($(this).val() === '') {
                            return false;
                        }
                    });
                }

                $scope.goback = function () {
                    $location.url('/');
                };

    }])

    .controller('HomepageController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {

            if(userPersistence.getCookieData() === undefined){
                $location.url('/');
            }

    }])

    .controller('UserprofileController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {

            if(userPersistence.getCookieData() === undefined){
                $location.url('/');
            }

        $scope.username = userPersistence.getCookieData();
        $scope.user = [];

        var getuserInfo = function(){
            $http.post('/users/userinfo', {'username' : $scope.username})
                .then(function(response){
                    $scope.user = response.data;
                   console.log(response.data);
                });
        };
        getuserInfo();
    }])

    .controller('WorkpartnerController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {

        $scope.interests = [];
        $scope.age = ['18', '22', '26', '30'];

            if(userPersistence.getCookieData() === undefined){
                $location.url('/');
            };

            $scope.getWords = function(search){
                return $http.post('/matching/getwords', {'word' : search})
                    .then( function (response){
                        console.log(response.data);
                        return response.data;
                    });
            };

            $scope.addWord = function(word){
                $scope.interests.push(word);
                console.log(word);
            }

            $scope.removeInterest = function(item){
                for(var i = 0; i < $scope.interests.length; i++){
                    if(($scope.interests[i].word === item.word) && ($scope.interests[i].category === item.category)){
                        $scope.interests.splice(i, 1);
                    }
                }
            };

    }])

    .controller('GroupController', ['$scope', '$location', '$http', 'userPersistence',
        function($scope, $location, $http, userPersistence) {

            if(userPersistence.getCookieData() === undefined){
                $location.url('/');
            }
        $scope.groups = false;
        $scope.searchList = [];
        $scope.selectedItem = '';
        $scope.memberList = [];
        $scope.selectedGroup = '';
        $scope.post = false;

        var getGroups = function() {
            $http.post('/groups/groupsmemberof', {'username' : userPersistence.getCookieData()})
                .then(function (response){
                    $scope.memberList = response.data;
                });
        };
        getGroups();

            $scope.creatingGroup = function() {
            $scope.groups = true;
        };

        $scope.cancelGroup = function() {
            $scope.groups = false;
        };

        $scope.createGroup = function() {
            var groupName = $scope.groupname;
            var groupJSON = {
                'groupname' : groupName,
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
                        getGroups();
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
                    getGroups();
                    $scope.selectedItem = '';
                    $scope.searchText = '';
                    console.log(response.data);
            });
        };

        $scope.postGroup = function(groupName){
            var postJSON = {
                'username' : userPersistence.getCookieData(),
                'groupname' : groupName,
                'post' : $scope.grouppost
            };

            $http.post('/groups/postingroup', postJSON)
                .then(function(response){
                   $scope.$parent.grouppost = '';
                   $scope.post = false;
                   getGroups();
                });
        };

        $scope.chooseGroup = function(groupName){
            console.log(groupName);
            $scope.selectedGroup = groupName;
        };

        $scope.getGroups = function(searchText) {
            if(searchText !== '') {
                return $http.get('/groups/getgroups/' + searchText)
                    .then(function (response) {
                        return response.data;
                    });
            }
        };

        $scope.goBack = function(){
            $scope.selectedGroup = '';
            console.log('back');
        };

        $scope.getDescription = function(groupName) {
            if(groupName !== '') {
                return $http.get('/groups/getdescription/' + groupName)
                    .then(function (response) {
                        return response.data;
                    });
            }
        };

        $scope.areMember = function(groupName) {
            if(groupName !== '') {
                console.log($scope.memberList);
                for (var i = 0; i < $scope.memberList.length; i++) {
                    if ($scope.memberList[i] === groupName) {
                        return true;
                    }
                }
                return false;
            } else{
                return false;
            }
        }
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