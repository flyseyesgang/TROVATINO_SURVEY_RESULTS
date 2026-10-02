// ========================================
// 10-QUESTION SURVEY DATA
// ========================================
const surveyQuestions = [
    {
        type: 'text',
        question: "What is your favourite gelato flavour?",
        placeholder: "Type your answer here..."
    },
    {
        type: 'radio',
        question: "How often do you visit our store?",
        options: ["Never", "Once a month", "Weekly", "Daily"]
    },
    {
        type: 'text',
        question: "What time of day do you prefer to visit us?",
        placeholder: "e.g., Morning / Afternoon / Evening"
    },
    {
        type: 'radio',
        question: "Which payment method do you prefer?",
        options: ["Cash", "Card", "Mobile Payment"]
    },
    {
        type: 'text',
        question: "What would you change about our store?",
        placeholder: "Share your honest feedback..."
    },
    {
        type: 'radio',
        question: "How would you rate our staff?",
        options: ["Excellent", "Good", "Average", "Poor"]
    },
    {
        type: 'text',
        question: "What is your age group?",
        placeholder: "e.g., 18-25, 26-35, etc."
    },
    {
        type: 'radio',
        question: "How did you hear about us?",
        options: ["Social Media", "Friend/Family", "Advertisement", "Other"]
    },
    {
        type: 'text',
        question: "What is one thing we do well?",
        placeholder: "Tell us what we're doing right!"
    }
];

// ========================================
// 2. NAVIGATION FUNCTIONS (FIXED)
// ========================================
let currentQuestion = 0;

function loadQuestion() {
    const questionData = surveyQuestions[currentQuestion];
    const questionContent = document.getElementById('questionContent');
    
    // Set progress bar
    const progressPercentage = ((currentQuestion + 1) / surveyQuestions.length) * 100;
    document.getElementById('progressFill').style.width = progressPercentage + '%';
    
    // Render question based on type
    if (questionData.type === 'text') {
        questionContent.innerHTML = `
            <h2 class="question-number">${currentQuestion + 1}. ${questionData.question}</h2>
            <textarea 
                name="answer" 
                class="survey-answer" 
                placeholder="${questionData.placeholder}" 
                required
            ></textarea>
        `;
    } else if (questionData.type === 'radio') {
        const radioHTML = questionData.options.map((option, index) => 
            `<label style="display: block; margin: 10px 0;">
                <input type="radio" name="answer" value="${option}" required>
                ${option}
            </label>`
        ).join('');
        
        questionContent.innerHTML = `
            <h2 class="question-number">${currentQuestion + 1}. ${questionData.question}</h2>
            <div style="text-align: left;">${radioHTML}</div>
        `;
    }
}

function goBack() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function goNext() {
    // Get the answer from the input field
    const questionContent = document.getElementById('questionContent');
    const textAnswer = questionContent.querySelector('textarea')?.value;
    
    if (currentQuestion === surveyQuestions.length - 1) {
        // Final question - submit form
        alert('🎉 Thank you for completing the survey!');
        currentQuestion++; // Move past final question
        
        // Reset for next visit
        currentQuestion = 0;
        loadQuestion();
    } else {
        // Regular navigation - check answer first
        const selectedAnswer = questionContent.querySelector('input[type="radio"]:checked')?.value;
        
        if (!textAnswer && !selectedAnswer) {
            alert('Please provide an answer before continuing!');
            return;
        }
        
        currentQuestion++;
        loadQuestion();
    }
}

// ========================================
// 3. INITIALIZATION
// ========================================
// Load first question on page load
window.onload = function() {
    currentQuestion = 0;
    loadQuestion();
};
