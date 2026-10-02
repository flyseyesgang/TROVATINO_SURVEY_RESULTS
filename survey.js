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
    // ... rest of your questions (keep existing)
];

// ========================================
// 4. FORM SUBMISSION SETUP
// ========================================
const surveyForm = document.getElementById('surveyForm');
let currentQuestion = 0;
let isSubmitting = false;

// ========================================
// 2. NAVIGATION FUNCTIONS (UPGRADED)
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
                name="answer" 
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
    if (!answerValue) {
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
    const textAnswer = document.querySelector('textarea')?.value;
    const selectedAnswer = document.querySelector(`input[name="answer-${currentQuestion}"]:checked`)?.value;
    
    if (currentQuestion === surveyQuestions.length - 1) {
        // Final question - prepare for submission!
        
        // Make sure final answer is saved to hidden field
        updateHiddenAnswer(textAnswer || selectedAnswer);
        
        // Get the final answer value
        const finalInput = surveyForm.querySelector(`input[name="question-${surveyQuestions.length}"]`);
        if (finalInput) {
            finalInput.value = textAnswer || selectedAnswer;
        }

        // Show thank you message
        alert('🎉 Thank you for completing the survey! Your responses are being sent...');
        
        // Disable buttons to prevent further input
        const btnBack = document.querySelector('.btn-back');
        const btnNext = document.querySelector('.btn-next');
        
        btnBack.style.display = 'none';
        btnNext.innerHTML = '<span>Submitting...</span>';
        btnNext.disabled = true;
        
        // Submit the form to Formspree after brief delay
        setTimeout(() => {
            if (surveyForm) {
                surveyForm.submit();
                
                // Optionally, you can redirect to a thank-you page
                // window.location.href = 'https://flyseyesgang.github.io/TROVATINO_SURVEY_RESULTS/thank-you.html';
            }
        }, 1000);

    } else {
        // Regular navigation - check answer first
        const selectedAnswer = document.querySelector(`input[name="answer-${currentQuestion}"]:checked`)?.value;
        
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
