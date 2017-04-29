/**
 * Created by root on 12/04/2017.
 * Code to be placed in the signup controller along with a button to call the addUsers method with parameter 0
 */

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

//addUser method that takes parameter 0 to start the counter, and creates as many users as necessary
$scope.addUsers = function(counter) {
    if (counter > 819) {
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
        //chooses interest words randomly between 1 and 20 from the degree of the user
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
            //makes sure duplicate words cannot be added
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