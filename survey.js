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
    { type: 'text', question: "What is one thing we do well?", placeholder: "Tell us what we're doing right!" }
];

// ========================================
// 4. FORM SUBMISSION SETUP
// ========================================
const surveyForm = document.getElementById('surveyForm');
let currentQuestion = 0;
let isSubmitting = false;

// ========================================
// 2. NAVIGATION FUNCTIONS (FIXED)
// ========================================
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
                name="answer-${currentQuestion}" 
                id="question-${currentQuestion}" 
                class="survey-answer" 
                placeholder="${questionData.placeholder}" 
                required
            ></textarea>
        `;
        
        // Capture text answer into hidden field as user types
        const textarea = questionContent.querySelector('textarea');
        if (textarea) {
            textarea.addEventListener('input', function() {
                updateHiddenAnswer(this.value);
            });
        }
    } else if (questionData.type === 'radio') {
        const radioHTML = questionData.options.map((option, index) => 
            `<label style="display: block; margin: 10px 0;">
                <input type="radio" name="answer-${currentQuestion}" value="${option}" required>
                ${option}
            </label>`
        ).join('');
        
        questionContent.innerHTML = `
            <h2 class="question-number">${currentQuestion + 1}. ${questionData.question}</h2>
            <div style="text-align: left;">${radioHTML}</div>
        `;

        // Capture radio selection into hidden field on change
        const radios = questionContent.querySelectorAll(`input[name="answer-${currentQuestion}"]`);
        if (radios.length > 0) {
            radios.forEach(radio => {
                radio.addEventListener('change', function() {
                    updateHiddenAnswer(this.value);
                });
            });
        }
    }
}

// Helper function to update hidden form field with current answer
function updateHiddenAnswer(value) {
    const inputName = `question-${currentQuestion}`;
    let answerValue = value.trim(); // For text inputs
    
    // Handle radio button values properly
    if (!answerValue || answerValue === '') {
        const checkedRadio = document.querySelector(`input[name="answer-${currentQuestion}"]:checked`);
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

function goBack() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function goNext() {
    // Check if answer is provided for current question
    const textAnswer = document.querySelector(`textarea[name="answer-${currentQuestion}"]`)?.value;
    const selectedAnswer = document.querySelector(`input[type="radio"]:checked`)?.value;
    
    if (currentQuestion === surveyQuestions.length - 1) {
        // Final question - prepare for submission!
        
        // Make sure final answer is saved to hidden field
        let finalAnswer = '';
        const finalTextarea = document.querySelector(`textarea[name="answer-${currentQuestion}"]`);
        if (finalTextarea) {
            finalAnswer = finalTextarea.value.trim();
        } else {
            const checkedRadio = document.querySelector('input[type="radio"]:checked');
            if (checkedRadio) {
                finalAnswer = checkedRadio.value;
            }
        }
        
        // Save to hidden field
        const inputName = `question-${currentQuestion}`;
        let existingInput = surveyForm.querySelector(`input[name="${inputName}"]`);
        
        if (!existingInput) {
            const newInput = document.createElement('input');
            newInput.type = 'hidden';
            newInput.name = inputName;
            newInput.value = finalAnswer;
            surveyForm.appendChild(newInput);
        } else {
            existingInput.value = finalAnswer;
        }

        // Show thank you message
        alert('🎉 Thank you for completing the survey! Your responses are being sent...');
        
        // Disable buttons to prevent further input
        const btnBack = document.querySelector('.btn-back');
        const btnNext = document.querySelector('.btn-next');
        
        btnBack.style.display = 'none';
        btnNext.innerHTML = '<span>Submitting...</span>';
        btnNext.disabled = true;
        
        // Submit the form to Formspree immediately (no timeout needed)
        if (surveyForm) {
            surveyForm.submit();
            
            // Reset after submission for next visitor
            setTimeout(() => {
                currentQuestion = 0;
                loadQuestion(); // Load first question for next person
            }, 1000);
        }

    } else {
        // Regular navigation - check answer first
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

// Optional: Handle form submission error gracefully
surveyForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Let Formspree handle the submit
    
    // Show success message before redirect (optional)
    const btnNext = document.querySelector('.btn-next');
    if (btnNext) {
        btnNext.innerHTML = '<span>📧 Sent! Thank you!</span>';
        btnNext.disabled = true;
    }
});
