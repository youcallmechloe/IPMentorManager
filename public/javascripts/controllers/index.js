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

    .controller('HeaderController', ['$scope', 'userPersistenceSession', 'userPersistenceUsername', '$location', '$http',
        function($scope, userPersistenceSession, userPersistenceUsername, $location, $http){

        $scope.getUsername = function(){
            return userPersistenceUsername.getCookieData();
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
            $location.url('/home');
        };

    }])

    .controller('LoginController', ['$scope', '$location', '$http', 'userPersistenceSession', 'userPersistenceUsername',
        function ($scope, $location, $http, userPersistenceSession, userPersistenceUsername) {

        if(userPersistenceSession.getCookieData() !== undefined){
            $location.url('/home');
        }

            $scope.login = function () {
                var username = $scope.username;

                var loginData = {
                    'username': username,
                    'password': $scope.password
                };

                $http.post("/users/loginuser", loginData)
                    .then(function (response) {
                        console.log(response.data);
                        if (response.data !== "false") {
                            userPersistenceSession.setCookieData(response.data);
                            userPersistenceUsername.setCookieData(username);
                            console.log(response.data);
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

    .controller('SignupController', ['$scope', '$location', '$http', 'userPersistenceSession', 'userPersistenceUsername',
        function($scope, $location, $http, userPersistenceSession, userPersistenceUsername) {


            if(userPersistenceSession.getCookieData() !== undefined){
                $location.url('/home');
            }

            var CSinterestWords = [{'word' : 'Algorithm', 'category' : 'Computer Science'},
                {'word' : 'Programming', 'category' : 'Computer Science'},
                {'word' : 'Database', 'category' : 'Computer Science'},
                {'word' : 'Web Development', 'category' : 'Computer Science'},
                {'word' : 'Javascript', 'category' : 'Computer Science'},
                {'word' : 'Python', 'category' : 'Computer Science'},
                {'word' : 'Java', 'category' : 'Computer Science'},
                {'word' : 'HTML', 'category' : 'Computer Science'},
                {'word' : 'SQL', 'category' : 'Computer Science'},
                {'word' : 'Language', 'category' : 'Computer Science'}
                // ,
                // //10
                // {'word' : 'Simulation', 'category' : 'Computer Science'},
                // {'word' : 'Virtual', 'category' : 'Computer Science'},
                // {'word' : 'Systems', 'category' : 'Computer Science'},
                // {'word' : 'Sorting', 'category' : 'Computer Science'},
                // {'word' : 'Logic', 'category' : 'Computer Science'},
                // {'word' : 'Boolean', 'category' : 'Computer Science'},
                // {'word' : 'Array', 'category' : 'Computer Science'},
                // {'word' : 'String', 'category' : 'Computer Science'},
                // {'word' : 'Integer', 'category' : 'Computer Science'},
                // {'word' : 'Software', 'category' : 'Computer Science'}
            ];

            var BinterestWords = [{'word' : 'Anaesthetics', 'category' : 'Biology'},
                {'word' : 'Asexual reproduction', 'category' : 'Biology'},
                {'word' : 'Capillaries', 'category' : 'Biology'},
                {'word' : 'Diffusion', 'category' : 'Biology'},
                {'word' : 'Digestion', 'category' : 'Biology'},
                {'word' : 'Ecosystem', 'category' : 'Biology'},
                {'word' : 'Enzymes', 'category' : 'Biology'},
                {'word' : 'Fertilisation', 'category' : 'Biology'},
                {'word' : 'Homeostasis', 'category' : 'Biology'},
                {'word' : 'Hormone', 'category' : 'Biology'}
                // ,
                // //10
                // {'word' : 'Meiosis', 'category' : 'Biology'},
                // {'word' : 'Mitosis', 'category' : 'Biology'},
                // {'word' : 'Mutation', 'category' : 'Biology'},
                // {'word' : 'Nerve', 'category' : 'Biology'},
                // {'word' : 'Osmosis', 'category' : 'Biology'},
                // {'word' : 'Photosynthesis', 'category' : 'Biology'},
                // {'word' : 'Pollination', 'category' : 'Biology'},
                // {'word' : 'Respiration', 'category' : 'Biology'},
                // {'word' : 'Transpiration', 'category' : 'Biology'},
                // {'word' : 'Variation', 'category' : 'Biology'}
            ];

            var PinterestWords = [{'word' : 'Amplitude', 'category' : 'Physics'},
                {'word' : 'Conduction', 'category' : 'Physics'},
                {'word' : 'Energy', 'category' : 'Physics'},
                {'word' : 'Matter', 'category' : 'Physics'},
                {'word' : 'Electricity', 'category' : 'Physics'},
                {'word' : 'Astronomy', 'category' : 'Physics'},
                {'word' : 'Quantum', 'category' : 'Physics'},
                {'word' : 'Galaxy', 'category' : 'Physics'},
                {'word' : 'Particles', 'category' : 'Physics'},
                {'word' : 'Cosmology', 'category' : 'Physics'}
                // ,
                // //10
                // {'word' : 'Accelerometer', 'category' : 'Physics'},
                // {'word' : 'Atomic mass', 'category' : 'Physics'},
                // {'word' : 'Battery', 'category' : 'Physics'},
                // {'word' : 'Black hole', 'category' : 'Physics'},
                // {'word' : 'Boson', 'category' : 'Physics'},
                // {'word' : 'Electric field', 'category' : 'Physics'},
                // {'word' : 'Fusion', 'category' : 'Physics'},
                // {'word' : 'Gamma ray', 'category' : 'Physics'},
                // {'word' : 'Kelvin', 'category' : 'Physics'},
                // {'word' : 'Mass number', 'category' : 'Physics'}
            ];

            var GinterestWords = [{'word' : 'Earth', 'category' : 'Geography'},
                {'word' : 'Culture', 'category' : 'Geography'},
                {'word' : 'GIS', 'category' : 'Geography'},
                {'word' : 'Environment', 'category' : 'Geography'},
                {'word' : 'Climate', 'category' : 'Geography'},
                {'word' : 'Landscape', 'category' : 'Geography'},
                {'word' : 'River', 'category' : 'Geography'},
                {'word' : 'Social', 'category' : 'Geography'},
                {'word' : 'Weather Hazards', 'category' : 'Geography'},
                {'word' : 'Economy', 'category' : 'Geography'}
                // ,
                // //10
                // {'word' : 'Abrasion', 'category' : 'Geography'},
                // {'word' : 'Climate Change', 'category' : 'Geography'},
                // {'word' : 'Core region', 'category' : 'Geography'},
                // {'word' : 'Deregulation', 'category' : 'Geography'},
                // {'word' : 'Extinction', 'category' : 'Geography'},
                // {'word' : 'Globalisation', 'category' : 'Geography'},
                // {'word' : 'Hydropower', 'category' : 'Geography'},
                // {'word' : 'Infrastructure', 'category' : 'Geography'},
                // {'word' : 'Migration', 'category' : 'Geography'},
                // {'word' : 'Polar', 'category' : 'Geography'}
            ];

            var EinterestWords = [{'word' : 'Markets', 'category' : 'Economics'},
                {'word' : 'Strategy', 'category' : 'Economics'},
                {'word' : 'Trade', 'category' : 'Economics'},
                {'word' : 'Finance', 'category' : 'Economics'},
                {'word' : 'Bootstrapping', 'category' : 'Economics'},
                {'word' : 'Calculus', 'category' : 'Economics'},
                {'word' : 'Costs and Efficiency', 'category' : 'Economics'},
                {'word' : 'Covariance', 'category' : 'Economics'},
                {'word' : 'Least squares', 'category' : 'Economics'},
                {'word' : 'Microeconomics', 'category' : 'Economics'}
                // ,
                // //10
                // {'word' : 'Demand', 'category' : 'Economics'},
                // {'word' : 'Discrete', 'category' : 'Economics'},
                // {'word' : 'Equilibrium', 'category' : 'Economics'},
                // {'word' : 'Hedging', 'category' : 'Economics'},
                // {'word' : 'Identification', 'category' : 'Economics'},
                // {'word' : 'Monopoly', 'category' : 'Economics'},
                // {'word' : 'Profit', 'category' : 'Economics'},
                // {'word' : 'Slope', 'category' : 'Economics'},
                // {'word' : 'Supply', 'category' : 'Economics'},
                // {'word' : 'Utility', 'category' : 'Economics'}
            ];

            var EnginterestWords = [{'word' : 'Alliteration', 'category' : 'English'},
                {'word' : 'Imperative', 'category' : 'English'},
                {'word' : 'Metaphor', 'category' : 'English'},
                {'word' : 'Oxymoron', 'category' : 'English'},
                {'word' : 'Personification', 'category' : 'English'},
                {'word' : 'Rhyme', 'category' : 'English'},
                {'word' : 'Simile', 'category' : 'English'},
                {'word' : 'Narcissistic', 'category' : 'English'},
                {'word' : 'Enjambment', 'category' : 'English'},
                {'word' : 'Colloquial', 'category' : 'English'}
            ];

            var PsycinterestWords = [{'word' : 'Addiction', 'category' : 'Psychology'},
                {'word' : 'Aggression', 'category' : 'Psychology'},
                {'word' : 'Altruism', 'category' : 'Psychology'},
                {'word' : 'Behavioral', 'category' : 'Psychology'},
                {'word' : 'Egocentrism', 'category' : 'Psychology'},
                {'word' : 'Encoding', 'category' : 'Psychology'},
                {'word' : 'Estrogen', 'category' : 'Psychology'},
                {'word' : 'Schizophrenic', 'category' : 'Psychology'},
                {'word' : 'Occipital lobe', 'category' : 'Psychology'},
                {'word' : 'Receptive', 'category' : 'Psychology'}
            ];

            var CinterestWords = [{'word' : 'Addiction', 'category' : 'Chemistry'},
                {'word' : 'Addiction', 'category' : 'Chemistry'},
                {'word' : 'Addiction', 'category' : 'Chemistry'},
                {'word' : 'Addiction', 'category' : 'Chemistry'},
                {'word' : 'Addiction', 'category' : 'Chemistry'},
                {'word' : 'Addiction', 'category' : 'Chemistry'},
                {'word' : 'Addiction', 'category' : 'Chemistry'},
                {'word' : 'Addiction', 'category' : 'Chemistry'},
                {'word' : 'Addiction', 'category' : 'Chemistry'},
                {'word' : 'Addiction', 'category' : 'Chemistry'}
            ];

            var FinterestWords = [{'word' : 'Addiction', 'category' : 'Fashion'},
                {'word' : 'Addiction', 'category' : 'Fashion'},
                {'word' : 'Addiction', 'category' : 'Fashion'},
                {'word' : 'Addiction', 'category' : 'Fashion'},
                {'word' : 'Addiction', 'category' : 'Fashion'},
                {'word' : 'Addiction', 'category' : 'Fashion'},
                {'word' : 'Addiction', 'category' : 'Fashion'},
                {'word' : 'Addiction', 'category' : 'Fashion'},
                {'word' : 'Addiction', 'category' : 'Fashion'},
                {'word' : 'Addiction', 'category' : 'Fashion'}
            ];

            var NinterestWords = [{'word' : 'Addiction', 'category' : 'Nursing'},
                {'word' : 'Addiction', 'category' : 'Nursing'},
                {'word' : 'Addiction', 'category' : 'Nursing'},
                {'word' : 'Addiction', 'category' : 'Nursing'},
                {'word' : 'Addiction', 'category' : 'Nursing'},
                {'word' : 'Addiction', 'category' : 'Nursing'},
                {'word' : 'Addiction', 'category' : 'Nursing'},
                {'word' : 'Addiction', 'category' : 'Nursing'},
                {'word' : 'Addiction', 'category' : 'Nursing'},
                {'word' : 'Addiction', 'category' : 'Nursing'}
            ];

            var LinterestWords = [{'word' : 'Addiction', 'category' : 'Law'},
                {'word' : 'Addiction', 'category' : 'Law'},
                {'word' : 'Addiction', 'category' : 'Law'},
                {'word' : 'Addiction', 'category' : 'Law'},
                {'word' : 'Addiction', 'category' : 'Law'},
                {'word' : 'Addiction', 'category' : 'Law'},
                {'word' : 'Addiction', 'category' : 'Law'},
                {'word' : 'Addiction', 'category' : 'Law'},
                {'word' : 'Addiction', 'category' : 'Law'},
                {'word' : 'Addiction', 'category' : 'Law'}
            ];

            var MinterestWords = [{'word' : 'Addiction', 'category' : 'Maths'},
                {'word' : 'Addiction', 'category' : 'Maths'},
                {'word' : 'Addiction', 'category' : 'Maths'},
                {'word' : 'Addiction', 'category' : 'Maths'},
                {'word' : 'Addiction', 'category' : 'Maths'},
                {'word' : 'Addiction', 'category' : 'Maths'},
                {'word' : 'Addiction', 'category' : 'Maths'},
                {'word' : 'Addiction', 'category' : 'Maths'},
                {'word' : 'Addiction', 'category' : 'Maths'},
                {'word' : 'Addiction', 'category' : 'Maths'}
            ];

            var MuinterestWords = [{'word' : 'Addiction', 'category' : 'Music'},
                {'word' : 'Addiction', 'category' : 'Music'},
                {'word' : 'Addiction', 'category' : 'Music'},
                {'word' : 'Addiction', 'category' : 'Music'},
                {'word' : 'Addiction', 'category' : 'Music'},
                {'word' : 'Addiction', 'category' : 'Music'},
                {'word' : 'Addiction', 'category' : 'Music'},
                {'word' : 'Addiction', 'category' : 'Music'},
                {'word' : 'Addiction', 'category' : 'Music'},
                {'word' : 'Addiction', 'category' : 'Music'}
            ];

            var SinterestWords = [{'word' : 'Addiction', 'category' : 'Sociology'},
                {'word' : 'Addiction', 'category' : 'Sociology'},
                {'word' : 'Addiction', 'category' : 'Sociology'},
                {'word' : 'Addiction', 'category' : 'Sociology'},
                {'word' : 'Addiction', 'category' : 'Sociology'},
                {'word' : 'Addiction', 'category' : 'Sociology'},
                {'word' : 'Addiction', 'category' : 'Sociology'},
                {'word' : 'Addiction', 'category' : 'Sociology'},
                {'word' : 'Addiction', 'category' : 'Sociology'},
                {'word' : 'Addiction', 'category' : 'Sociology'}
            ];

            var HinterestWords = [{'word' : 'Addiction', 'category' : 'History'},
                {'word' : 'Addiction', 'category' : 'History'},
                {'word' : 'Addiction', 'category' : 'History'},
                {'word' : 'Addiction', 'category' : 'History'},
                {'word' : 'Addiction', 'category' : 'History'},
                {'word' : 'Addiction', 'category' : 'History'},
                {'word' : 'Addiction', 'category' : 'History'},
                {'word' : 'Addiction', 'category' : 'History'},
                {'word' : 'Addiction', 'category' : 'History'},
                {'word' : 'Addiction', 'category' : 'History'}
            ];

            var FiinterestWords = [{'word' : 'Addiction', 'category' : 'Film'},
                {'word' : 'Addiction', 'category' : 'Film'},
                {'word' : 'Addiction', 'category' : 'Film'},
                {'word' : 'Addiction', 'category' : 'Film'},
                {'word' : 'Addiction', 'category' : 'Film'},
                {'word' : 'Addiction', 'category' : 'Film'},
                {'word' : 'Addiction', 'category' : 'Film'},
                {'word' : 'Addiction', 'category' : 'Film'},
                {'word' : 'Addiction', 'category' : 'Film'},
                {'word' : 'Addiction', 'category' : 'Film'}
            ];

            var LaninterestWords = [{'word' : 'Addiction', 'category' : 'Language'},
                {'word' : 'Addiction', 'category' : 'Language'},
                {'word' : 'Addiction', 'category' : 'Language'},
                {'word' : 'Addiction', 'category' : 'Language'},
                {'word' : 'Addiction', 'category' : 'Language'},
                {'word' : 'Addiction', 'category' : 'Language'},
                {'word' : 'Addiction', 'category' : 'Language'},
                {'word' : 'Addiction', 'category' : 'Language'},
                {'word' : 'Addiction', 'category' : 'Language'},
                {'word' : 'Addiction', 'category' : 'Language'}
            ];

            var PhinterestWords = [{'word' : 'Addiction', 'category' : 'Pharmacology'},
                {'word' : 'Addiction', 'category' : 'Pharmacology'},
                {'word' : 'Addiction', 'category' : 'Pharmacology'},
                {'word' : 'Addiction', 'category' : 'Pharmacology'},
                {'word' : 'Addiction', 'category' : 'Pharmacology'},
                {'word' : 'Addiction', 'category' : 'Pharmacology'},
                {'word' : 'Addiction', 'category' : 'Pharmacology'},
                {'word' : 'Addiction', 'category' : 'Pharmacology'},
                {'word' : 'Addiction', 'category' : 'Pharmacology'},
                {'word' : 'Addiction', 'category' : 'Pharmacology'}
            ];

            var PhyinterestWords = [{'word' : 'Addiction', 'category' : 'Physiotherapy'},
                {'word' : 'Addiction', 'category' : 'Physiotherapy'},
                {'word' : 'Addiction', 'category' : 'Physiotherapy'},
                {'word' : 'Addiction', 'category' : 'Physiotherapy'},
                {'word' : 'Addiction', 'category' : 'Physiotherapy'},
                {'word' : 'Addiction', 'category' : 'Physiotherapy'},
                {'word' : 'Addiction', 'category' : 'Physiotherapy'},
                {'word' : 'Addiction', 'category' : 'Physiotherapy'},
                {'word' : 'Addiction', 'category' : 'Physiotherapy'},
                {'word' : 'Addiction', 'category' : 'Physiotherapy'}
            ];

            var SpinterestWords = [{'word' : 'Addiction', 'category' : 'Spanish'},
                {'word' : 'Addiction', 'category' : 'Spanish'},
                {'word' : 'Addiction', 'category' : 'Spanish'},
                {'word' : 'Addiction', 'category' : 'Spanish'},
                {'word' : 'Addiction', 'category' : 'Spanish'},
                {'word' : 'Addiction', 'category' : 'Spanish'},
                {'word' : 'Addiction', 'category' : 'Spanish'},
                {'word' : 'Addiction', 'category' : 'Spanish'},
                {'word' : 'Addiction', 'category' : 'Spanish'},
                {'word' : 'Addiction', 'category' : 'Spanish'}
            ];


            var degreeList = ['Computer Science', 'Biology', 'Physics', 'Geography', 'Economics', 'Psychology', 'English',
                                'Chemistry', 'Fashion', 'Nursing', 'Law', 'Maths', 'Music', 'Sociology', 'History', 'Film',
                                'Language', 'Pharmacology', 'Physiotherapy', 'Spanish'];

            $scope.addUsers = function(counter) {
                if (counter > 99) {
                    return;
                } else {
                    var gender;
                    if (Math.random() > 0.5) {
                        gender = "Female";
                    } else {
                        gender = "Male";
                    }

                    var degree = degreeList[Math.floor(Math.random() * degreeList.length)];
                    var knowledge = [];
                    for (var j = 0; j < Math.floor((Math.random() * 20) + 1); j++) {
                        var interest;
                        switch (degree) {
                            case "Computer Science":
                                interest = CSinterestWords[Math.floor(Math.random() * CSinterestWords.length)];
                                break;
                            case "Biology":
                                interest = BinterestWords[Math.floor(Math.random() * BinterestWords.length)];
                                break;
                            case "Physics":
                                interest = PinterestWords[Math.floor(Math.random() * PinterestWords.length)];
                                break;
                            case "Geography":
                                interest = GinterestWords[Math.floor(Math.random() * GinterestWords.length)];
                                break;
                            case "Psychology":
                                interest = PsycinterestWords[Math.floor(Math.random() * PsycinterestWords.length)];
                                break;
                            case "Chemistry":
                                interest = CinterestWords[Math.floor(Math.random() * CinterestWords.length)];
                                break;
                            case "Fashion":
                                interest = FinterestWords[Math.floor(Math.random() * FinterestWords.length)];
                                break;
                            case "Nursing":
                                interest = NinterestWords[Math.floor(Math.random() * NinterestWords.length)];
                                break;
                            case "Law":
                                interest = LinterestWords[Math.floor(Math.random() * LinterestWords.length)];
                                break;
                            case "Maths":
                                interest = MinterestWords[Math.floor(Math.random() * MinterestWords.length)];
                                break;
                            case "Music":
                                interest = MuinterestWords[Math.floor(Math.random() * MuinterestWords.length)];
                                break;
                            case "Sociology":
                                interest = SinterestWords[Math.floor(Math.random() * SinterestWords.length)];
                                break;
                            case "History":
                                interest = HinterestWords[Math.floor(Math.random() * HinterestWords.length)];
                                break;
                            case "Film":
                                interest = FiinterestWords[Math.floor(Math.random() * FiinterestWords.length)];
                                break;
                            case "Language":
                                interest = LaninterestWords[Math.floor(Math.random() * LaninterestWords.length)];
                                break;
                            case "Pharmacology":
                                interest = PhinterestWords[Math.floor(Math.random() * PhinterestWords.length)];
                                break;
                            case "Physiotherapy":
                                interest = PhyinterestWords[Math.floor(Math.random() * PhyinterestWords.length)];
                                break;
                            case "Spanish":
                                interest = SpinterestWords[Math.floor(Math.random() * SpinterestWords.length)];
                                break;
                            case "English":
                                interest = EnginterestWords[Math.floor(Math.random() * EnginterestWords.length)];
                                break;
                            case "Economics":
                                interest = EinterestWords[Math.floor(Math.random() * EinterestWords.length)];
                                break;

                        }
                        if (knowledge.indexOf(interest) === -1) {
                            knowledge.push(interest);
                        }
                    }

                    var userID = Math.random();

                    var exampleUser = {
                        'username': "user" + userID,
                        'email': "user" + userID + "@example.com",
                        'password': "user" + userID,
                        'fullname': "User" + userID + " Example",
                        'age': Math.floor((Math.random() * 30) + 10),
                        'gender': gender,
                        'degree': degree,
                        'knowledge': JSON.stringify(knowledge)
                    };

                    $http.post("/users/checkusername", {'username': name})
                        .then(function (response) {
                            var bool = response.data;

                            if (bool) {
                                $http.post("/users/addUser", exampleUser)
                                    .then(function (response) {
                                        if (response.data !== 'false') {
                                            console.log("user" + counter);
                                        } else {
                                            alert('There has been a problem creating your account. Please try again.')
                                        }
                                    });
                            } else {
                                alert('Username taken, please choose another');
                            }
                            counter++;
                            $scope.addUsers(counter);
                        });

                }
            };

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

                console.log($scope.interests);
                var newUser = {
                    'username': username,
                    'email': $scope.email,
                    'password': $scope.password,
                    'fullname': $scope.fullname,
                    'age': $scope.age,
                    'gender': $scope.GenderRadio,
                    'degree': $scope.degree,
                    'knowledge': JSON.stringify($scope.interests)
                };

                console.log(newUser);
                $http.post("/users/checkusername", {'username': name})
                    .then(function (response) {
                        var bool = response.data;

                        if (bool) {
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

            var getPartners = function(){
                $http.post('/matching/getpartners', {'username' : userPersistenceUsername.getCookieData(),
                                                        'sessionID' : userPersistenceSession.getCookieData()})
                    .then(function(response){
                        $scope.partners = response.data;
                    });
            };
            getPartners();

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

    }])

    .controller('UserprofileController', ['$scope', '$location', '$http', 'userPersistenceSession', 'userPersistenceUsername',
        function($scope, $location, $http, userPersistenceSession, userPersistenceUsername) {

            if(userPersistenceSession.getCookieData() === undefined){
                $location.url('/');
            }

        $scope.username = userPersistenceUsername.getCookieData();
        $scope.user = [];

        var getuserInfo = function(){
            $http.post('/users/userinfo', {'username' : $scope.username, 'sessionID' : userPersistenceSession.getCookieData()})
                .then(function(response){
                    $scope.user = response.data;
                   console.log(response.data);
                });
        };
        getuserInfo();
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

            if(userPersistenceSession.getCookieData() === undefined){
                $location.url('/');
            };

            $scope.getWords = function(search){
                return $http.post('/matching/getwords', {'word' : search})
                    .then( function (response){
                        return response.data;
                    });
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
                var data = {'gender' : $scope.Gender,
                        'minAge' : $scope.minAge,
                        'maxAge' : $scope.maxAge,
                        'interests' : $scope.interests,
                        'sessionID' : userPersistenceSession.getCookieData(),
                        'username' : userPersistenceUsername.getCookieData(),
                        'similar' : $scope.similar};
                $http.post('/matching/matching3', data)
                    .then(function(response){
                        $scope.find = false;
                        $scope.fullresponse = true;
                        $scope.matches = response.data;
                        $scope.partner = $scope.MentorType;
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
        $scope.groups = false;
        $scope.searchList = [];
        $scope.selectedItem = '';
        $scope.memberList = [];
        $scope.selectedGroup = '';
        $scope.post = false;

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
                'posts' : [],
                'username' : userPersistenceUsername.getCookieData(),
                'sessionID' : userPersistenceSession.getCookieData()
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

            $http.post('/groups/postingroup', postJSON)
                .then(function(response){
                    $scope.$parent.grouppost = '';
                    $scope.post = false;
                    $scope.memberList = [];
                    getGroups();
                    $scope.chooseGroup(response.data);
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