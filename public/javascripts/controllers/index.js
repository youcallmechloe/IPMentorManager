/**
 * Created by root on 01/02/2017.
 */
/**
 * Created by root on 01/02/2017.
 */

angular.module('app', ['ngRoute', 'ngResource', 'ngMaterial', 'ngCookies', 'ngMdIcons', 'ngPageTitle'])

//---------------
// Services
//---------------
//
    .factory('userPersistenceSession', ['$cookies', function($cookies){
        var session = "";
        return {
            setCookieData: function(username){
                session = username;
                $cookies.put("session", username);
            },
            getCookieData: function() {
                session = $cookies.get("session");
                return session;
            },
            clearCookieData: function() {
                session = "";
                $cookies.remove("session");
            }
        }
    }])

    .factory('userPersistenceUsername', ['$cookies', function($cookies){
        var userName = "";
        return {
            setCookieData: function(username){
                userName = username;
                $cookies.put("username", username);
            },
            getCookieData: function() {
                userName = $cookies.get("username");
                return userName;
            },
            clearCookieData: function() {
                userName = "";
                $cookies.remove("username");
            }
        }
    }])

    //---------------
    // Controllers
    //---------------

    .controller('HeaderController', ['$scope', 'userPersistenceSession', 'userPersistenceUsername', '$location', '$http', '$route',
        function($scope, userPersistenceSession, userPersistenceUsername, $location, $http, $route){

        $scope.getUsername = function(){
            return userPersistenceUsername.getCookieData();
        };

        $scope.MentoringClick = function(){
            if($location.url() === "/mentor"){
                $route.reload();
            } else{
                $location.url('/mentor');

            }
        };
        $scope.GroupsClick = function(){
            if($location.url() === "/group"){
                $route.reload();
            } else{
                $location.url('/group');

            }
        };
        $scope.ProfileClick = function(){
            if($location.url() === "/profile"){
                $route.reload();
            } else{
                $location.url('/profile');

            }
        };

            $scope.isOpen = false;

            $scope.demo = {
                isOpen: false,
                selectedDirection: 'right',
                selectedMode: 'md-scale',
                hidden: false
            };

        $scope.isLoggedIn = function(){
            if(userPersistenceSession.getCookieData() !== undefined){
                return true;
            } else{
                return false;
            }
        };

        $scope.userLogout = function(){
            var logged = confirm("Do you want to log out?");
            if(logged === true){
                $http.post('/users/logoutuser', {'username' : userPersistenceUsername.getCookieData(), 'sessionID' : userPersistenceSession.getCookieData()})
                    .then(function(response){
                        if(response.data === "true"){
                            userPersistenceSession.clearCookieData();
                            userPersistenceUsername.clearCookieData();
                            $location.url('/');
                        } else{
                            alert('Something went wrong, please try again');
                        }
                    });
            }
        };

        $scope.goHome = function() {
            if($location.url() === "/home"){
                $route.reload();
            } else{
                $location.url('/home');

            }
        };

    }])

    .controller('LoginController', ['$scope', '$location', '$http', 'userPersistenceSession', 'userPersistenceUsername',
        function ($scope, $location, $http, userPersistenceSession, userPersistenceUsername) {

        if(userPersistenceSession.getCookieData() !== undefined){
            $location.url('/home');
        }

            $scope.login = function () {
                var username = $scope.username;

                if(($scope.username === undefined) || ($scope.password === undefined)){
                    alert("Some fields empty, please fill in all fields.")
                } else {

                    var loginData = {
                        'username': username,
                        'password': $scope.password
                    };

                    $http.post("/users/loginuser", loginData)
                        .then(function (response) {
                            console.log(response.data);
                            if (response.data === "false username") {
                                alert("Username incorrect, please try again.");
                            } else if(response.data === "false password"){
                                alert("Password incorrect, please try again");
                            } else {
                                userPersistenceSession.setCookieData(response.data);
                                userPersistenceUsername.setCookieData(username);
                                console.log(response.data);
                                $location.url('/home');
                            }
                        });
                }

            };


            $scope.createAccount = function () {
                $location.url('/signup');
            };

    }])

    .controller('SignupController', ['$scope', '$location', '$http', 'userPersistenceSession', 'userPersistenceUsername',
        function($scope, $location, $http, userPersistenceSession, userPersistenceUsername) {


            if(userPersistenceSession.getCookieData() !== undefined){
                $location.url('/home');
            }

            var limit = 10;
            var counter = 1;
            $scope.GenderRadio = "Female";
            $scope.categoryList = ['Accounting and Finance', 'Anthropology', 'Archaeology', 'Art', 'Astronomy', 'Biochemistry', 'Biology',
                    'Business', 'Chemistry', 'Computer Science', 'Criminology', 'Ecology', 'Economics', 'Education Studies', 'Engineering',
                    'English', 'Environmental Science', 'Fashion', 'Film', 'French', 'Geography', 'Geology', 'Geophysics',
                    'German', 'History', 'Information Technology', 'Language', 'Law', 'Management', 'Marketing', 'Mathematical Sciences',
                    'Medicine', 'Midwifery', 'Music', 'Natural Sciences', 'Nursing', 'Oceanography', 'Pharmacology', 'Philosophy',
                    'Physics', 'Physiotherapy', 'Politics and International Relations', 'Psychology', 'Ship Science', 'Sociology',
                    'Spanish', 'Zoology', 'Other'];
            $scope.interests = [{
                word : '',
                category: ''
            }];

            $scope.addNew = function () {
                if (counter !== limit) {
                    $scope.interests.push({word: '', category: ''});
                    counter++;
                } else {
                    alert("You've reached the limit on interest fields!")
                }
            };

            $scope.removeInterest = function (item) {
                for (var i = 0; i < $scope.interests.length; i++) {
                    if (($scope.interests[i].word === item.word) && ($scope.interests[i].category === item.category)) {
                        $scope.interests.splice(i, 1);
                        counter--;
                        break;
                    }
                }
            };

            $scope.getCategory = function (search) {
                var newList = [];
                if (search !== '') {
                    for (var i = 0; i < $scope.categoryList.length; i++) {
                        console.log($scope.categoryList[i]);
                        console.log(search);
                        if ($scope.categoryList[i].indexOf(search) !== -1) {
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

            //TODO: check that boxes are filled before posting!!
            $scope.signup = function () {
                var username = $scope.username;
                var degree;
                if($scope.degree === 'Other'){
                    degree = $scope.degreetitle;
                } else{
                    degree = $scope.degree;
                }

                var newUser = {
                    'username': username,
                    'email': $scope.email,
                    'password': $scope.password,
                    'fullname': $scope.fullname,
                    'age': $scope.age,
                    'gender': $scope.GenderRadio,
                    'degree': degree,
                    'knowledge': JSON.stringify($scope.interests)
                };

                if(($scope.username === undefined) || ($scope.email === undefined) || ($scope.password === undefined) ||
                    ($scope.fullname === undefined) || ($scope.age === undefined) || ($scope.GenderRadio === undefined) ||
                    ($scope.degree === undefined)){
                    alert("Some fields are empty, please fill in all fields");
                } else if($scope.interests.length < 1){
                    alert("You must have at least 1 knowledge area, please try again.")
                } else {
                    var bool = true;
                    for(var i = 0; i < $scope.interests.length; i++){
                        if(($scope.interests[i]['word'] === undefined) || ($scope.interests[i]['category'] === undefined)){
                            bool = false;
                            alert("Some fields are empty, please fill in all fields");
                        }
                    }
                    console.log(newUser);
                    if(bool) {
                        $http.post("/users/checkusername", {'username': name})
                            .then(function (response) {
                                var bool = response.data;

                                if (response.data === "false") {
                                    console.log("posting");
                                    $http.post("/users/addUser", newUser)
                                        .then(function (response) {
                                            console.log(response.data);
                                            if (response.data !== 'false') {
                                                userPersistenceUsername.setCookieData(username);
                                                userPersistenceSession.setCookieData(response.data);
                                                console.log(username);
                                                $location.url('/home');
                                            } else {
                                                alert('There has been a problem creating your account. Please try again.')
                                            }
                                        });
                                } else {
                                    alert('Username taken, please choose another');
                                }
                            });
                    }
                }
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

    .controller('HomepageController', ['$scope', '$location', '$http', 'userPersistenceSession', 'userPersistenceUsername',
        function($scope, $location, $http, userPersistenceSession, userPersistenceUsername) {

            if(userPersistenceSession.getCookieData() === undefined){
                $location.url('/');
            }

            $scope.partners = [];
            $scope.pointvalue = 10;

            var getPartners = function(){
                $http.post('/matching/getpartners', {'username' : userPersistenceUsername.getCookieData(),
                                                        'sessionID' : userPersistenceSession.getCookieData()})
                    .then(function(response){
                        $scope.partners = response.data;
                    });
            };
            getPartners();

            var getGroup = function(){
                $http.post('/groups/groupsown', {'username':userPersistenceUsername.getCookieData(),
                                            'sessionID' : userPersistenceSession.getCookieData()})
                    .then(function(response){
                        $scope.groups = response.data;
                    });
            };
            getGroup();

            $scope.accept = function(item){
                var userrelation;
                if(item.relation === 'mentor'){
                    userrelation = 'mentee';
                } else{
                    userrelation = 'mentor';
                }

                var data = {'username' : userPersistenceUsername.getCookieData(),
                    'sessionID' : userPersistenceSession.getCookieData(),
                    'partnername' : item.username,
                    'relation' : item.relation,
                    'partnerrelation' : userrelation};

                $http.post('/matching/acceptpartner', data)
                    .then(function(response){
                        getPartners();
                    });
            };

            $scope.addPoints = function(username, point){
                var data = {'username' : username,
                            'amount' : point,
                            'madeusername' : userPersistenceUsername.getCookieData()};
                console.log(data);
                $http.post('/users/addtoscore', data)
                    .then(function(response){
                        console.log(response);
                        if(response.data === ""){
                            alert("Points added to " + username + "'s score!")
                        }
                    });
            }
    }])

    .controller('UserprofileController', ['$scope', '$location', '$http', 'userPersistenceSession', 'userPersistenceUsername', '$mdDialog',
        function($scope, $location, $http, userPersistenceSession, userPersistenceUsername, $mdDialog) {

            if(userPersistenceSession.getCookieData() === undefined){
                $location.url('/');
            }

            $scope.categoryList = ['Accounting and Finance', 'Anthropology', 'Archaeology', 'Art', 'Astronomy', 'Biochemistry', 'Biology',
                'Business', 'Chemistry', 'Computer Science', 'Criminology', 'Ecology', 'Economics', 'Education Studies', 'Engineering',
                'English', 'Environmental Science', 'Fashion', 'Film', 'French', 'Geography', 'Geology', 'Geophysics',
                'German', 'History', 'Information Technology', 'Language', 'Law', 'Management', 'Marketing', 'Mathematical Sciences',
                'Medicine', 'Midwifery', 'Music', 'Natural Sciences', 'Nursing', 'Oceanography', 'Pharmacology', 'Philosophy',
                'Physics', 'Physiotherapy', 'Politics and International Relations', 'Psychology', 'Ship Science', 'Sociology',
                'Spanish', 'Zoology', 'Other'];
            $scope.interests = [{
                word : '',
                category: ''
            }];
        $scope.username = userPersistenceUsername.getCookieData();
        $scope.user = [];
        $scope.change = false;
            var counter = $scope.interests.length;
            var limit = 10;

            var getuserInfo = function(){
            $http.post('/users/userinfo', {'username' : $scope.username, 'sessionid' : userPersistenceSession.getCookieData()})
                .then(function(response){
                    console.log(response.data);
                    $scope.user = response.data;
                    $scope.interests = response.data.knowledge;
                });
        };
        getuserInfo();

            $scope.addNew = function () {
                if (counter !== limit) {
                    $scope.interests.push({word: '', category: ''});
                    counter++;
                } else {
                    alert("You've reached the limit on interest fields!")
                }
            };

            var newuser = "0-50 Points: New User";
            var beginner = "5-200 Points: Beginner";

            $scope.showAlert = function(ev) {
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application
                // to prevent interaction outside of dialog
                $mdDialog.show(
                    $mdDialog.show()
                        .clickOutsideToClose(true)
                        .title('Levels')
                        .content(newuser + '<br>' + beginner)
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Got it!')
                        .targetEvent(ev)
                );
            };

            $scope.showCustom = function(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    scope: $scope,
                    preserveScope: true,
                    template: '<md-dialog style="width: 300;">' +
                        '<md-toolbar>' +
                    '    <div class="md-toolbar-tools">' +
                    '        <h2 style="color: #eeeeee;">Levels</h2>' +
                    '</div>   ' +
                    '   </md-toolbar>' +
                    '  <md-dialog-content style="color: #636363;">' +
                        '<div class="md-dialog-content">' +
                    '<p></p>' +
                    '<p>0-50 Points: New User</p>' +
                    '<p>5-200 Points: Beginner</p>' +
                    '<p>200-500 Points: Novice</p>' +
                    '<p>500-1000 Points: Intermediate</p>' +
                    '<p>1000-2000 Points: Advanced</p>' +
                    '<p>2000-5000 Points: Expert</p>' +
                    '<p>5000-10000 Points: Professional</p>' +
                    '<p>10000+ Points: Guru</p>' +
                    '</div>' +
                    '  </md-dialog-content>' +
                    '</md-dialog>',
                    controller: function DialogController($scope, $mdDialog) {
                        $scope.closeDialog = function() {
                            $mdDialog.hide();
                        }
                    }
                });
            };

            // $scope.showAdvanced = function(ev) {
            //     $mdDialog.show({
            //         controller: DialogController,
            //         templateUrl: 'partials/dialog1.tmpl.html',
            //         parent: angular.element(document.body),
            //         targetEvent: ev,
            //         clickOutsideToClose: true
            //     });
            // };

            function DialogController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            }

            $scope.removeInterest = function (item) {
                for (var i = 0; i < $scope.interests.length; i++) {
                    if (($scope.interests[i].word === item.word) && ($scope.interests[i].category === item.category)) {
                        $scope.interests.splice(i, 1);
                        counter--;
                        break;
                    }
                }
            };

            //TODO: make sure all interests inputs are not blank
        $scope.saveInterests = function(){
            var bool = true;
            for(var i = 0; i< $scope.interests.length; i++){
                console.log($scope.interests[i]);
                if(($scope.interests[i]['word'] === "") || ($scope.interests[i]['category'] === "") || ($scope.interests[i]['word'] === undefined) ){
                    bool = false;
                    alert("Some fields empty, please fill in all fields.")
                }
            }
            if(bool) {
                $http.post('/users/changeinterests', {
                    'username': userPersistenceUsername.getCookieData(),
                    'knowledge': $scope.interests
                })
                    .then(function (response) {
                        console.log(response.data);
                        if (response.data === "") {
                            $scope.change = false;
                        } else {
                            alert("Adding interests failed, please try again.")
                        }
                    });
            }
        };

        $scope.saveProfile = function(){
            $scope.profchange = false;
            var data = {'username' : userPersistenceUsername.getCookieData(),
                        'sessionid' : userPersistenceSession.getCookieData(),
                        'email' : $scope.user.email,
                        'fullname' : $scope.user.fullname};
            console.log(data);
            $http.post('/users/changedetails', data)
                .then(function(response){
                    if(response.data === ""){
                        $scope.change = false;
                    } else{
                        alert("Changing details failed, please try again.")
                    }
                });
        };

            $scope.removeUser = function(){
                var c = confirm("Do you want to delete your account?");
                console.log("sfds");
                if(c){
                    $http.post('/users/deleteuser', {'username' : userPersistenceUsername.getCookieData(),
                        'sessionid' : userPersistenceSession.getCookieData()})
                        .then(function(response){
                                userPersistenceSession.clearCookieData();
                                userPersistenceUsername.clearCookieData();
                                $location.url('/');

                        });

            }
        }
    }])

    .controller('WorkpartnerController', ['$scope', '$location', '$http', 'userPersistenceSession','userPersistenceUsername',
        function($scope, $location, $http, userPersistenceSession, userPersistenceUsername) {

            $scope.categoryList = ['Accounting and Finance', 'Anthropology', 'Archaeology', 'Art', 'Astronomy', 'Biochemistry', 'Biology',
                'Business', 'Chemistry', 'Computer Science', 'Criminology', 'Ecology', 'Economics', 'Education Studies', 'Engineering',
                'English', 'Environmental Science', 'Fashion', 'Film', 'French', 'Geography', 'Geology', 'Geophysics',
                'German', 'History', 'Information Technology', 'Language', 'Law', 'Management', 'Marketing', 'Mathematical Sciences',
                'Medicine', 'Midwifery', 'Music', 'Natural Sciences', 'Nursing', 'Oceanography', 'Pharmacology', 'Philosophy',
                'Physics', 'Physiotherapy', 'Politics and International Relations', 'Psychology', 'Ship Science', 'Sociology',
                'Spanish', 'Zoology', 'Other'];
        $scope.interests = [];
        $scope.age = [18, 22, 26, 30];
        $scope.gender = ['Female', 'Male', 'None'];
        $scope.matches = [];
        var words = [];
        var wordcategories = [];

            if(userPersistenceSession.getCookieData() === undefined){
                $location.url('/');
            };

            $scope.clear = function(){
                $scope.matches = [];
                $scope.fullresponse = false;
                $scope.interests= [];
                $scope.Gender = "";
                $scope.minAge = "";
                $scope.maxAge = "";
                $scope.MentorType = "";
                $scope.searchText = "";
                $scope.itemCategory = "";
                $scope.similar = null;
            };

            $scope.getWords = function(search){
                return $http.post('/matching/getwords', {'word' : search})
                    .then( function (response){
                        for(var i = 0; i < response.data.length; i++){
                            words[i] = response.data[i]['word'];
                            wordcategories[i] = response.data[i]['category'];
                        }
                        return words;
                    });
            };

            $scope.changeCategory = function(item){
                for(var i = 0; i < words.length; i++){
                    $scope.itemCategory = wordcategories[words.indexOf(item)];
                }
            };

            $scope.addWord = function(word){
                var exists = false;
                if($scope.selectedItem !== null){
                    exists = true;
                }
                $scope.interests.push({'word' : word, 'category' : $scope.itemCategory, 'bool' : exists, 'score' : 1});
            };

            $scope.removeInterest = function(item){
                for(var i = 0; i < $scope.interests.length; i++){
                    if(($scope.interests[i].word === item.word) && ($scope.interests[i].category === item.category)){
                        $scope.interests.splice(i, 1);
                    }
                }
            };


            //TODO: add in degree choice?
            $scope.match = function(){
                $http.post('/matching/getpartners', {'username' : userPersistenceUsername.getCookieData(),
                                        'sessionID' : userPersistenceSession.getCookieData()})
                    .then(function (response) {
                        console.log(response.data);
                        var data = {'gender' : $scope.Gender,
                            'minAge' : $scope.minAge,
                            'maxAge' : $scope.maxAge,
                            'interests' : $scope.interests,
                            'sessionID' : userPersistenceSession.getCookieData(),
                            'username' : userPersistenceUsername.getCookieData(),
                            'similar' : $scope.similar,
                            'partners' : response.data};

                        if(($scope.Gender === undefined) || ($scope.minAge === undefined) || ($scope.maxAge === undefined) || ($scope.MentorType === undefined)){
                            alert("Some fields empty, please fill in all fields.")
                        } else if($scope.maxAge < $scope.minAge){
                            alert("Maximum age must be greater than minimum age, please try again.");
                        } else if($scope.interests.length < 1){
                            alert("You must include at least 1 knowledge area, please try again.")
                        } else{
                            console.log(data);
                            $http.post('/matching/matching3', data)
                                .then(function(response){
                                    $scope.find = false;
                                    $scope.fullresponse = true;
                                    $scope.matches = response.data;
                                    $scope.partner = $scope.MentorType;
                                });
                        }
                    });
            };

            $scope.request = function(item) {
                var theirstatus;
                if($scope.partner === 'mentor'){
                    theirstatus = 'mentee';
                } else{
                    theirstatus = 'mentor';
                }
                console.log(item);
                var data = {
                    'username': userPersistenceUsername.getCookieData(),
                    'sessionID': userPersistenceSession.getCookieData(),
                    'partner': item,
                    'partnerstatus' : $scope.partner,
                    'theirstatus' : theirstatus
                };
                $http.post('/matching/requestpartner', data)
                    .then(function(response){

                    });
            };

    }])

    //TODO: put text boxes for age so user can choose min and max age, makes it much easier
    .controller('GroupController', ['$scope', '$location', '$http', 'userPersistenceSession', 'userPersistenceUsername',
        function($scope, $location, $http, userPersistenceSession, userPersistenceUsername) {

            if(userPersistenceSession.getCookieData() === undefined){
                $location.url('/');
            }
        $scope.groups = true;
        $scope.searchList = [];
        $scope.selectedItem = '';
        $scope.memberList = [];
        $scope.selectedGroup = '';
        $scope.post = false;
        $scope.username = userPersistenceUsername.getCookieData();

        //TODO: search in descriptions too for more accurate searches
        var getGroups = function() {
            $http.post('/groups/groupsmemberof', {'username' : userPersistenceUsername.getCookieData(),
                'sessionID' : userPersistenceSession.getCookieData()})
                .then(function (response){
                    $scope.memberList = response.data;
                });
        };
        getGroups();

        $scope.creatingGroup = function() {
            $scope.selectedGroup = "";
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
                'admin' : userPersistenceUsername.getCookieData(),
                'members' : [userPersistenceUsername.getCookieData()],
                'username' : userPersistenceUsername.getCookieData(),
                'sessionID' : userPersistenceSession.getCookieData()
            };

            if(($scope.groupname === undefined) || ($scope.description === undefined)){
                alert("Some fields empty, please fill in all fields.")
            } else {
                $http.post("/groups/creategroup", groupJSON)
                    .then(function (response) {
                        if (response.data === 'false') {
                            alert('Sorry, that group name is taken, please choose another one');
                        } else {
                            getGroups();
                            $scope.groupname = '';
                            $scope.$parent.groupdescription = '';
                            $scope.groups = false;
                        }
                    });
            }

        };

        $scope.joinGroup = function(groupName){
            var joinJSON = {
                'username' : userPersistenceUsername.getCookieData(),
                'groupname' : groupName,
                'sessionID' : userPersistenceSession.getCookieData()
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
                'username' : userPersistenceUsername.getCookieData(),
                'groupname' : groupName['groupname'],
                'post' : $scope.grouppost,
                'sessionID' : userPersistenceSession.getCookieData()
            };

            if($scope.grouppost === undefined){
                alert("Some fields empty, please fill in all fields.")
            } else {
                $http.post('/groups/postingroup', postJSON)
                    .then(function (response) {
                        console.log(response.data);
                        $scope.$parent.grouppost = '';
                        $scope.post = false;
                        $scope.memberList = [];
                        getGroups();
                        $scope.chooseGroup(response.data);
                    });
            }
        };

        $scope.chooseGroup = function(groupName){
            $scope.group = false;
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
                    console.log($scope.memberList[i]);
                    if ($scope.memberList[i]['groupname'] === groupName) {
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
                data: {
                    pageTitle : "Mentor Manager"
                },
                templateUrl: 'partials/login.html',
                controller: 'LoginController'
            })
            .when('/signup', {
                data: {
                    pageTitle : "Create Account - Mentor Manager"
                },
                templateUrl: 'partials/signup.html',
                controller: 'SignupController'
            })
            .when('/home', {
                data: {
                    pageTitle : "Home - Mentor Manager"
                },
                templateUrl: 'partials/homepage.html',
                controller: 'HomepageController'
            })
            .when('/profile', {
                data: {
                    pageTitle : "Profile - Mentor Manager"
                },
                templateUrl: 'partials/userprofile.html',
                controller: 'UserprofileController'
            })
            .when('/mentor', {
                data: {
                    pageTitle : "Mentoring - Mentor Manager"
                },
                templateUrl: 'partials/mentor.html',
                controller: 'WorkpartnerController'
            })
            .when('/group',  {
                data: {
                    pageTitle : "Groups - Mentor Manager"
                },
                templateUrl: 'partials/group.html',
                controller: 'GroupController'
            })
            .otherwise({

                redirectTo: '/'
            });
    }]);