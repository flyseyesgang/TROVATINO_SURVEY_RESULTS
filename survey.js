// ========================================
// 10-QUESTION SURVEY DATA
// ========================================
const surveyQuestions = [
    { type: 'text', question: "What is your favourite gelato flavour?", placeholder: "Type your answer here..." },
    { type: 'radio', question: "How often do you visit our store?", options: ["Never", "Once a month", "Weekly", "Daily"] },
    { type: 'text', question: "What time of day do you prefer to visit us?", placeholder: "e.g., Morning / Afternoon / Evening" },
    { type: 'radio', question: "Which payment method do you prefer?", options: ["Cash", "Card", "Mobile Payment"] },
    { type: 'text', question: "What would you change about our store?", placeholder: "Share your honest feedback..." },
    { type: 'radio', question: "How would you rate our staff?", options: ["Excellent", "Good", "Average", "Poor"] },
    { type: 'text', question: "What is your age group?", placeholder: "e.g., 18-25, 26-35, etc." },
    { type: 'radio', question: "How did you hear about us?", options: ["Social Media", "Friend/Family", "Advertisement", "Other"] },
    { type: 'text', question: "What is one thing we do well?", placeholder: "Tell us what we're doing right!" },
    { type: 'radio', question: "Hi Amelia, I wrote this from my bedroom :)", options: ["Hi Vince", "Select Hi Vince"] }
];

// ========================================
// FORM & STATE
// ========================================
const surveyForm = document.getElementById('surveyForm');
let currentQuestion = 0;
const totalQuestions = surveyQuestions.length; // Dynamically counts all questions

// ========================================
// LOAD QUESTION (RENDERED EVERY TIME)
// ========================================
function loadQuestion() {
    const questionData = surveyQuestions[currentQuestion];
    const questionContent = document.getElementById('questionContent');
    
    // Update progress bar
    const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progressPercentage + '%';
    
    // Render question header
    questionContent.innerHTML = `
        <h2 class="question-number">${currentQuestion + 1}. ${questionData.question}</h2>
    `;

    // Handle text input questions
    if (questionData.type === 'text') {
        const textarea = document.createElement('textarea');
        textarea.name = `answer-${currentQuestion}`;
        textarea.id = `question-${currentQuestion}`;
        textarea.className = 'survey-answer';
        textarea.placeholder = questionData.placeholder || '';
        
        // Add to page
        questionContent.appendChild(textarea);

        // Auto-save as user types (into hidden field)
        textarea.addEventListener('input', function() {
            updateHiddenAnswer(this.value, `answer-${currentQuestion}`);
        });
    } 
    // Handle radio button questions
    else if (questionData.type === 'radio') {
        const radiosDiv = document.createElement('div');
        radiosDiv.style.textAlign = 'left';

        const questionHtml = questionData.options.map((option, index) => 
            `<label style="display: block; margin: 10px 0;">
                <input type="radio" name="answer-${currentQuestion}" value="${option}" required>
                ${option}
            </label>`
        ).join('');

        const fragment = document.createRange().createContextualFragment(questionHtml);
        radiosDiv.appendChild(fragment);
        questionContent.appendChild(radiosDiv);

        // Attach listener to all radios
        radiosDiv.querySelectorAll(`input[name="answer-${currentQuestion}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                updateHiddenAnswer(this.value, `answer-${currentQuestion}`);
            });
        });
    }
}

// Helper: Save answer to hidden form field
function updateHiddenAnswer(value, fieldName) {
    const inputName = `question-${currentQuestion}`;
    
    // Get value from textarea or radio button
    let answerValue = '';
    const textarea = document.querySelector(`textarea[name="${fieldName}"]`);
    if (textarea) {
        answerValue = textarea.value.trim();
    } else {
        const checkedRadio = document.querySelector(`input[type="radio"]:checked`);
        if (checkedRadio) {
            answerValue = checkedRadio.value;
        }
    }

    // Create or update hidden input in form
    let existingInput = surveyForm.querySelector(`input[name="${inputName}"]`);
    
    if (existingInput) {
        existingInput.value = answerValue || '';
    } else {
        const newInput = document.createElement('input');
        newInput.type = 'hidden';
        newInput.name = inputName;
        newInput.value = answerValue || '';
        surveyForm.appendChild(newInput);
    }
}

// ========================================
// NAVIGATION FUNCTIONS
// ========================================
function goBack() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function goNext() {
    // Check if answer is provided for current question
    const fieldName = `answer-${currentQuestion}`;
    const textAnswer = document.querySelector(`textarea[name="${fieldName}"]`)?.value;
    const selectedAnswer = document.querySelector(`input[type="radio"]:checked`)?.value;
    
    if (currentQuestion === totalQuestions - 1) {
        // Final question — save and submit!
        
        // Make sure final answer is saved to hidden field
        updateHiddenAnswer(textAnswer || selectedAnswer, fieldName);

        // Show thank you message
        alert('🎉 Thank you for completing the survey! Your responses are being sent...');
        
        // Disable buttons
        const btnBack = document.querySelector('.btn-back');
        const btnNext = document.querySelector('.btn-next');
        
        btnBack.style.display = 'none';
        btnNext.innerHTML = '<span>Submitting...</span>';
        btnNext.disabled = true;
        
        // Submit the form to Formspree
        if (surveyForm) {
            surveyForm.submit();
            
            // Reset after submission for next visitor
            setTimeout(() => {
                currentQuestion = 0;
                loadQuestion(); // Load first question for next person
            }, 1000);
        }

    } else {
        // Regular navigation — check answer first
        if (!textAnswer && !selectedAnswer) {
            alert('Please provide an answer before continuing!');
            return;
        }
        
        currentQuestion++;
        loadQuestion();
    }
}

// ========================================
// INITIALIZATION
// ========================================
window.onload = function() {
    currentQuestion = 0;
    loadQuestion();
};

// Handle form submission error gracefully
surveyForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Let Formspree handle the submit
    
    const btnNext = document.querySelector('.btn-next');
    if (btnNext) {
        btnNext.innerHTML = '<span>📧 Sent! Thank you!</span>';
        btnNext.disabled = true;
    }
});
