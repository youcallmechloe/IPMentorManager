
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

    .controller('HeaderController', ['$scope', 'userPersistenceSession', 'userPersistenceUsername', '$location', '$http', '$route', '$mdDialog',
        function($scope, userPersistenceSession, userPersistenceUsername, $location, $http, $route, $mdDialog){

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
                selectedDirection: 'left',
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

        //Method to show info box on home button
            $scope.showCustom = function() {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    scope: $scope,
                    preserveScope: true,
                    template: '<md-dialog style="width: 30%;">' +
                    '<md-toolbar>' +
                    '    <div class="md-toolbar-tools">' +
                    '        <h2 style="color: #eeeeee;">Mentor Manager</h2>' +
                    '</div>   ' +
                    '   </md-toolbar>' +
                    '  <md-dialog-content style="color: #636363;">' +
                    '<div class="md-dialog-content">' +
                    '<p>Mentor Manager is a web application designed to help students find mentors easily.</p>' +
                    '<p>You can also crate and join groups based on academic work to aid group collaboration.</p>' +
                    '<p>Sign up and start collaborating today!</p>' +
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


        $scope.userLogout = function(){
            var logged = confirm("Do you want to log out?");
            if(logged === true){
                $http.post('/users/logoutuser', {'username' : userPersistenceUsername.getCookieData(), 'sessionid' : userPersistenceSession.getCookieData()})
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

        //if there's cookies then redirect to homepage
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
                            if (response.data === "false username") {
                                alert("Username incorrect, please try again.");
                            } else if(response.data === "false password"){
                                alert("Password incorrect, please try again");
                            } else {
                                userPersistenceSession.setCookieData(response.data);
                                userPersistenceUsername.setCookieData(username);
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

            //if there's cookie data then redirect to homepage
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

            //method to add new interest word option
            $scope.addNew = function () {
                if (counter !== limit) {
                    $scope.interests.push({word: '', category: ''});
                    counter++;
                } else {
                    alert("You've reached the limit on interest fields!")
                }
            };

            //method to remove an interest word
            $scope.removeInterest = function (item) {
                for (var i = 0; i < $scope.interests.length; i++) {
                    if (($scope.interests[i].word === item.word) && ($scope.interests[i].category === item.category)) {
                        $scope.interests.splice(i, 1);
                        counter--;
                        break;
                    }
                }
            };

            //gets the category for a specific word to fill the category box when an interest word is chosen
            $scope.getCategory = function (search) {
                var newList = [];
                if (search !== '') {
                    for (var i = 0; i < $scope.categoryList.length; i++) {
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

            //creates a user object then posts it to the server and redirects to homepage on successful return
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
                    if(bool) {
                        $http.post("/users/checkusername", {'username': name})
                            .then(function (response) {
                                var bool = response.data;

                                if (response.data === "false") {
                                    $http.post("/users/addUser", newUser)
                                        .then(function (response) {
                                            if (response.data !== 'false') {
                                                userPersistenceUsername.setCookieData(username);
                                                userPersistenceSession.setCookieData(response.data);
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

            $scope.goback = function () {
                $location.url('/');
            };

        }])

    .controller('HomepageController', ['$scope', '$location', '$http', 'userPersistenceSession', 'userPersistenceUsername', '$mdDialog',
        function($scope, $location, $http, userPersistenceSession, userPersistenceUsername, $mdDialog) {

        //if there's no cookie data redirect to the login page
            if(userPersistenceSession.getCookieData() === undefined){
                $location.url('/');
            }

            $scope.partners = [];
            $scope.pointvalue = 10;

            //functions to get a user's partners and groups
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

            //adds points to a user's score based on what option chose
            $scope.addPoints = function(username, point){
                var data = {'username' : username,
                            'amount' : point,
                            'madeusername' : userPersistenceUsername.getCookieData()};
                $http.post('/users/addtoscore', data)
                    .then(function(response){
                        if(response.data === ""){
                            $scope.pointUsername = username;
                            $scope.pointAmount = point;
                            showAlert();
                            // alert("Points added to " + username + "'s score!")
                        }
                    });
            };

            $scope.contact = function(username){
                var data = {'username' : username};
                $http.post('/users/getemail', data)
                    .then(function(response){
                        if(response.data !== ""){
                            $scope.partneremail = response.data;
                            showCustom(response.data);
                        }
                    });
            };

            var showAlert = function(){
                $mdDialog.show({
                    clickOutsideToClose: true,
                    scope: $scope,
                    preserveScope: true,
                    template: '<md-dialog style="width: 30%;">' +
                    '  <md-dialog-content style="color: #636363;">' +
                    '<div class="md-dialog-content">' +
                    '<p>{{pointAmount}} points added to {{pointUsername}}\'s score!</p>' +
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

            //method to show a popup box to a user when they click 'contact'
            var showCustom = function(email) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    scope: $scope,
                    preserveScope: true,
                    template: '<md-dialog style="width: 30%;">' +
                    '<md-toolbar>' +
                    '    <div class="md-toolbar-tools">' +
                    '        <h2 style="color: #eeeeee;">Contact Details</h2>' +
                    '</div>   ' +
                    '   </md-toolbar>' +
                    '  <md-dialog-content style="color: #636363;">' +
                    '<div class="md-dialog-content">' +
                    '<p>Currently the messaging system is not working so to contact your partner please email them!</p>' +
                    '<p>Email Address: {{partneremail}}</p>' +
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
    }])

    .controller('UserprofileController', ['$scope', '$location', '$http', 'userPersistenceSession', 'userPersistenceUsername', '$mdDialog',
        function($scope, $location, $http, userPersistenceSession, userPersistenceUsername, $mdDialog) {

            //if there's no cookie data redirect to the login page
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

            //method to get user's info from the db
            var getuserInfo = function(){
            $http.post('/users/userinfo', {'username' : $scope.username, 'sessionid' : userPersistenceSession.getCookieData()})
                .then(function(response){
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

            //method to show a popup contain user level info when prompted
            $scope.showCustom = function(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    scope: $scope,
                    preserveScope: true,
                    template: '<md-dialog style="width: 300px;">' +
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

            $scope.userLogout = function(){
                var logged = confirm("Do you want to log out?");
                if(logged === true){
                    $http.post('/users/logoutuser', {'username' : userPersistenceUsername.getCookieData(), 'sessionid' : userPersistenceSession.getCookieData()})
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

            $scope.removeInterest = function (item) {
                for (var i = 0; i < $scope.interests.length; i++) {
                    if (($scope.interests[i].word === item.word) && ($scope.interests[i].category === item.category)) {
                        $scope.interests.splice(i, 1);
                        counter--;
                        break;
                    }
                }
            };

            //method to update a user's interest words from the profile
        $scope.saveInterests = function(){
            var bool = true;
            for(var i = 0; i< $scope.interests.length; i++){
                if(($scope.interests[i]['word'] === "") || ($scope.interests[i]['category'] === "") || ($scope.interests[i]['word'] === undefined) ){
                    bool = false;
                    alert("Some fields empty, please fill in all fields.")
                }
            }
            if(bool) {
                $http.post('/users/changeinterests', {
                    'username': userPersistenceUsername.getCookieData(),
                    'sessionid' : userPersistenceSession.getCookieData(),
                    'knowledge': $scope.interests
                })
                    .then(function (response) {
                        if (response.data === "") {
                            $scope.change = false;
                        } else {
                            alert("Adding interests failed, please try again.")
                        }
                    });
            }
        };

        //method to update a user's information from the profile
        $scope.saveProfile = function(){
            var data = {'username' : userPersistenceUsername.getCookieData(),
                        'sessionid' : userPersistenceSession.getCookieData(),
                        'email' : $scope.user.email,
                        'fullname' : $scope.user.fullname,
                        'age' : $scope.user.age};

            if(($scope.user.email === undefined) || ($scope.user.fullname === undefined) || ($scope.user.age === undefined)){
                alert("Some fields empty, please fill in all fields.");
            } else {
                $scope.profchange = false;
                $http.post('/users/changedetails', data)
                    .then(function (response) {
                        if (response.data === "") {
                            $scope.change = false;
                        } else {
                            alert("Changing details failed, please try again.")
                        }
                    });
            }
        };

        //method to delete an account
            $scope.removeUser = function(){
                var c = confirm("Do you want to delete your account?");
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

            //if there's no cookie data redirect to the login page
            if(userPersistenceSession.getCookieData() === undefined){
                $location.url('/');
            }

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

            //get all matching words to passed parameter from database
            $scope.getWords = function(search){
                words = [];
                wordcategories = [];
                return $http.post('/matching/getwords', {'word' : search})
                    .then( function (response){
                        for(var i = 0; i < response.data.length; i++){
                            words[i] = response.data[i]['word'];
                            wordcategories[i] = response.data[i]['category'];
                        }
                        return words;
                    });
            };

            //update category to match chosen word in md-autocomplete
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
                console.log(word);
                console.log($scope.interests)
            };

            $scope.removeInterest = function(item){
                for(var i = 0; i < $scope.interests.length; i++){
                    if(($scope.interests[i].word === item.word) && ($scope.interests[i].category === item.category)){
                        $scope.interests.splice(i, 1);
                    }
                }
            };


            //sends data object to server to find partners matching requirements
            $scope.match = function(){
                $scope.matches = [];

                $http.post('/matching/getpartners', {'username' : userPersistenceUsername.getCookieData(),
                                        'sessionID' : userPersistenceSession.getCookieData()})
                    .then(function (response) {
                        var data = {'gender' : $scope.Gender,
                            'minAge' : $scope.minAge,
                            'maxAge' : $scope.maxAge,
                            'interests' : $scope.interests,
                            'sessionID' : userPersistenceSession.getCookieData(),
                            'username' : userPersistenceUsername.getCookieData(),
                            'similar' : $scope.similar,
                            'partners' : response.data};

                        console.log(data);

                        //checks that all fields are complete and that min and max ages are correct
                        if(($scope.Gender === undefined) || ($scope.minAge === undefined) || ($scope.maxAge === undefined) || ($scope.MentorType === undefined)){
                            alert("Some fields empty, please fill in all fields.");
                        } else if($scope.maxAge < $scope.minAge){
                            alert("Maximum age must be greater than minimum age, please try again.");
                        } else if($scope.interests.length < 1){
                            alert("You must include at least 1 knowledge area, please try again.");
                        } else{
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

            //method to request a partner and updates database with statuses
            $scope.request = function(item) {
                var theirstatus;
                if($scope.partner === 'mentor'){
                    theirstatus = 'mentee';
                } else{
                    theirstatus = 'mentor';
                }
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

    .controller('GroupController', ['$scope', '$location', '$http', 'userPersistenceSession', 'userPersistenceUsername',
        function($scope, $location, $http, userPersistenceSession, userPersistenceUsername) {

            //if there's no cookie data redirect to the login page
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

        //returns groups that a user is a member of
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

        //creates a group using input fields and checks whether groupname is taken already and if not creates it and updates page
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

            if(($scope.groupname === undefined) || ($scope.$parent.groupdescription === undefined)){
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
            };

            $http.post('/groups/joingroup', joinJSON)
                .then(function(response){
                    getGroups();
                    $scope.selectedItem = '';
                    $scope.searchText = '';
            });
        };

        $scope.leaveGroup = function(groupName){
            var data = { 'username' : userPersistenceUsername.getCookieData(),
                'groupname' : groupName.groupname,
                'sessionID' : userPersistenceSession.getCookieData()
            };

            if(groupName.admin === userPersistenceUsername.getCookieData()){
                alert('You cant leave a group you own!');
            } else {
                var c = confirm("Do you want to leave " + groupName.groupname);
                if(c) {
                    $http.post('/groups/leavegroup', data)
                        .then(function (response) {
                            getGroups();
                            $scope.selectedGroup = '';
                        });
                }
            }
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
                for (var i = 0; i < $scope.memberList.length; i++) {
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