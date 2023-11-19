// Global storage for player data
var PlayerRegistrationData = [];

// Global storage for incorrect answers
var IncorrectAnswers = [];
// Global storage for gender and percentage data
var GenderData = [];
var PercentageData = [];




// Function to calculate age from date of birth
document.getElementById("dob").addEventListener("change", function() {
    var dob = this.value;
    var age = calculateAge(dob);
    document.getElementById("age").value = age;
});

function calculateAge(dob) {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Function to handle player registration
function Register() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var dob = document.getElementById("dob").value;
    var age = calculateAge(dob);
    var gender = document.querySelector('input[name="gender"]:checked').value;
    var email = document.getElementById("email").value;

    // Validation checks
    if (firstName.length < 3 || lastName.length < 3) {
        alert("First Name and Last Name must be at least 3 characters long.");
        return;
    }

    if (!email.endsWith("@gmail.com")) {
        alert("Email address must end with @gmail.com.");
        return;
    }

    if (age < 8 || age > 12) {
        alert("Age must be between 8 and 12 inclusive.");
        return;
    }

    // Create player data object
    var playerData = {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        age: age,
        gender: gender,
        email: email,
        totalQuestions: 0,
        correctAnswers: 0,
        percentage: 0.00
    };

    // Add player data to global storage
    PlayerRegistrationData.push(playerData);
	//NEWLY ADDED //////////////////////////////////
	// Show registration form and hide other sections
    document.getElementById('registrationForm').style.display = 'block';
    document.getElementById('playAreaSection').style.display = 'none';
    document.getElementById('resultsAreaSection').style.display = 'none';
	////////////////////////////////////////////////////////////////////

    // Reset form and update button states
    document.getElementById("registrationForm").reset();
    document.getElementById("age").value = age;
    document.getElementById("registerBtn").disabled = true;
    document.getElementById("startBtn").disabled = false;
    document.getElementById("endBtn").disabled = false;
    document.getElementById("percentageBtn").disabled = false;
}

	// Function to start a new game
	function PlayGame() {
    var num1 = Math.floor(Math.random() * 9) + 1;
    var num2 = Math.floor(Math.random() * 5) + 1;
    var equation = num1 + " x " + num2 + " = ";
    document.getElementById("equation").textContent = equation;

    // Enable answer input and buttons
    document.getElementById("answer").disabled = false;
    document.getElementById("checkBtn").disabled = false;
    document.getElementById("nextBtn").disabled = false;
	// Hide registration form
            document.getElementById('registrationForm').style.display = 'none';

            // Show play area section
            document.getElementById('playAreaSection').style.display = 'block';
	// Scroll to the Play Area section
    document.getElementById('playAreaSection').scrollIntoView({ behavior: 'smooth' });
	// Manipulate browser history
    history.pushState(null, null, '#playAreaContainer');
}

// Function to check player's answer
function CheckAnswer() {
    var userAnswer = document.getElementById("answer").value;
    var equation = document.getElementById("equation").textContent;
    var parts = equation.split("x");
    var correctAnswer = parseInt(parts[0].trim()) * parseInt(parts[1].trim());

    var isCorrect = userAnswer == correctAnswer;

    var currentPlayer = PlayerRegistrationData[PlayerRegistrationData.length - 1];

    // Update player's stats
    currentPlayer.totalQuestions++;
    currentPlayer.correctAnswers += isCorrect ? 1 : 0;
    currentPlayer.percentage = (currentPlayer.correctAnswers / currentPlayer.totalQuestions) * 100;

    // Store incorrect answers
    if (!isCorrect) {
        IncorrectAnswers.push({
            firstName: currentPlayer.firstName,
            lastName: currentPlayer.lastName,
            equation: equation,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer
        });
		showIncorrectAnswers();
    }

    // Display result message
    var resultMessage = isCorrect ? "Correct!" : "Incorrect!";
    document.getElementById("result").textContent = resultMessage;

    // Update displays
    showAllStats();
    showPercentageScore();
    showIncorrectAnswers();
}

//start here 
// Function to end the game session
function EndGame() {
    // Reset form and button states
    document.getElementById("registrationForm").reset();
    document.getElementById("registerBtn").disabled = false;
    document.getElementById("startBtn").disabled = true;
    document.getElementById("endBtn").disabled = true;
    document.getElementById("percentageBtn").disabled = true;

    // Clear play area
    document.getElementById("equation").textContent = "";
    document.getElementById("answer").value = ""; // Reset answer input field
    document.getElementById("answer").disabled = true;
    document.getElementById("checkBtn").disabled = true;
    document.getElementById("nextBtn").disabled = true;
    document.getElementById("result").textContent = "";

    // Enable registration button and disable other buttons
    document.getElementById("registerBtn").disabled = false;
    document.getElementById("startBtn").disabled = true;
    document.getElementById("endBtn").disabled = true;
    document.getElementById("percentageBtn").disabled = true;

    // Show results area section
    document.getElementById('resultsAreaSection').style.display = 'block';

    // Display all player stats, percentage score, and incorrect answers
    showAllStats();
    showPercentageScore();
    showIncorrectAnswers();

    // Check if the button already exists before adding it
    var existingButton = document.getElementById('goBackButton');
    if (!existingButton) {
        // Display a button to go back to the registration form
        var resultsAreaContainer = document.getElementById('resultsArea');
        resultsAreaContainer.innerHTML += `
            <button id="goBackButton" onclick="showRegistrationForm()">Go Back to Registration Form</button>
        `;
    }

    // Scroll to the Results Area section
    document.getElementById('resultsAreaSection').scrollIntoView({ behavior: 'smooth' });
}

	// Function to show the registration form
	function showRegistrationForm() {
    // Hide results area section
    document.getElementById('resultsAreaSection').style.display = 'none';

    // Show registration form
    document.getElementById('registrationForm').style.display = 'block';

    // Scroll to the Registration Form section
    document.getElementById('registrationForm').scrollIntoView({ behavior: 'smooth' });
}


//end here

// Function to display all player stats
function showAllStats() {
    var showallplayers = document.getElementById("showallplayers");
    showallplayers.innerHTML = "";

    for (var i = 0; i < PlayerRegistrationData.length; i++) {
        var player = PlayerRegistrationData[i];
        showallplayers.innerHTML += `Name: ${player.firstName} ${player.lastName}, Age: ${player.age}, Gender: ${player.gender}, Total Questions: ${player.totalQuestions}, Correct Answers: ${player.correctAnswers}, Percentage: ${player.percentage.toFixed(2)}%<br>`;
    }
}

// Function to display player's percentage score
function showPercentageScore() {
    var currentPlayer = PlayerRegistrationData[PlayerRegistrationData.length - 1];
    var playerName = currentPlayer.firstName;
    var totalQuestions = currentPlayer.totalQuestions;
    var correctAnswers = currentPlayer.correctAnswers;
    var percentage = currentPlayer.percentage;



    var currentDate = new Date().toLocaleDateString();

    var showpercentage = document.getElementById("showpercentage");
	
	

    showpercentage.innerHTML = `Player Name: ${playerName}<br>`;
    showpercentage.innerHTML += `Total Questions: ${totalQuestions}<br>`;
    showpercentage.innerHTML += `Correct Answers: ${correctAnswers}<br>`;
    showpercentage.innerHTML += `Percentage Score: ${percentage.toFixed(2)}%<br>`;
    showpercentage.innerHTML += `Date: ${currentDate}`;
}



function showPercentageAndCharts() {
    // Show percentage score
    showPercentageScore();
    // Show charts
    showCharts();
}



// Function to display incorrect answers
function showIncorrectAnswers() {
    var showIncorrect = document.getElementById("showIncorrect");
    showIncorrect.innerHTML = "";

    for (var i = 0; i < IncorrectAnswers.length; i++) {
        var incorrect = IncorrectAnswers[i];
        showIncorrect.innerHTML += `Name: ${incorrect.firstName} ${incorrect.lastName}, Equation: ${incorrect.equation}, User Answer: ${incorrect.userAnswer}, Correct Answer: ${incorrect.correctAnswer}<br>`;
    }
}


function showCharts() {
    var totalPlayers = PlayerRegistrationData.length;

    // Count instances of gender
    var maleCount = PlayerRegistrationData.filter(player => player.gender === 'male').length;
    var femaleCount = PlayerRegistrationData.filter(player => player.gender === 'female').length;

    // Calculate percentages
    var malePercentage = (maleCount / totalPlayers) * 100;
    var femalePercentage = (femaleCount / totalPlayers) * 100;

    // Create and update gender chart with images
    document.getElementById('genderChart').innerHTML = `
        <div>Male: <img src="thinbar.png" height=20px width="${malePercentage.toFixed(2)}%"> ${malePercentage.toFixed(2)}%</div>
        <div>Female: <img src="thinbar.png" height=20px width="${femalePercentage.toFixed(2)}%"> ${femalePercentage.toFixed(2)}%</div>
    `;

    // Count correct answers for each percentage range
    var correctCounts = [0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < PlayerRegistrationData.length; i++) {
        var player = PlayerRegistrationData[i];
        var percentage = player.percentage;

        if (percentage < 50) {
            correctCounts[0]++;
        } else if (percentage < 60) {
            correctCounts[1]++;
        } else if (percentage < 70) {
            correctCounts[2]++;
        } else if (percentage < 80) {
            correctCounts[3]++;
        } else if (percentage < 90) {
            correctCounts[4]++;
        } else if (percentage < 100) {
            correctCounts[5]++;
        } else {
            correctCounts[6]++;
        }
    }

    // Create and update percentage score chart with images
    document.getElementById('scoreChart').innerHTML = `
        <div>&lt;50: <img src="thinbar.png" height=20px width="${((correctCounts[0] / totalPlayers) * 100).toFixed(2)}%"> ${correctCounts[0]} players (${((correctCounts[0] / totalPlayers) * 100).toFixed(2)}%)</div>
        <div>50-59: <img src="thinbar.png" height=20px width="${((correctCounts[1] / totalPlayers) * 100).toFixed(2)}%"> ${correctCounts[1]} players (${((correctCounts[1] / totalPlayers) * 100).toFixed(2)}%)</div>
        <div>60-69: <img src="thinbar.png" height=20px width="${((correctCounts[2] / totalPlayers) * 100).toFixed(2)}%"> ${correctCounts[2]} players (${((correctCounts[2] / totalPlayers) * 100).toFixed(2)}%)</div>
        <div>70-79: <img src="thinbar.png" height=20px width="${((correctCounts[3] / totalPlayers) * 100).toFixed(2)}%"> ${correctCounts[3]} players (${((correctCounts[3] / totalPlayers) * 100).toFixed(2)}%)</div>
        <div>80-89: <img src="thinbar.png" height=20px width="${((correctCounts[4] / totalPlayers) * 100).toFixed(2)}%"> ${correctCounts[4]} players (${((correctCounts[4] / totalPlayers) * 100).toFixed(2)}%)</div>
        <div>90-99: <img src="thinbar.png" height=20px width="${((correctCounts[5] / totalPlayers) * 100).toFixed(2)}%"> ${correctCounts[5]} players (${((correctCounts[5] / totalPlayers) * 100).toFixed(2)}%)</div>
        <div>100: <img src="thinbar.png" height=20px width="${((correctCounts[6] / totalPlayers) * 100).toFixed(2)}%"> ${correctCounts[6]} players (${((correctCounts[6] / totalPlayers) * 100).toFixed(2)}%)</div>
    `;
}

// Call showCharts every 5 seconds
setInterval(showCharts, 5000);

function showPercentageAndCharts() {
    showPercentageScore();
    showCharts();
}



