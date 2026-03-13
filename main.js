document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers');
    const historyList = document.getElementById('history-list');
    const themeBtn = document.getElementById('theme-btn');
    const htmlElement = document.documentElement;

    // Inquiry Form elements
    const inquiryForm = document.getElementById('inquiry-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    // Theme logic
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeBtn.addEventListener('click', () => {
        const theme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(theme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeBtn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }

    // Lotto logic
    generateBtn.addEventListener('click', () => {
        const lottoNumbers = generateLottoNumbers();
        displayNumbers(lottoNumbers);
        addToHistory(lottoNumbers);
    });

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function displayNumbers(numbers) {
        numbersContainer.innerHTML = '';
        numbers.forEach((number, index) => {
            setTimeout(() => {
                const numberElement = document.createElement('div');
                numberElement.className = 'number';
                numberElement.textContent = number;
                numberElement.style.backgroundColor = getNumberColor(number);
                numbersContainer.appendChild(numberElement);
            }, index * 100);
        });
    }

    function addToHistory(numbers) {
        const li = document.createElement('li');
        const now = new Date().toLocaleTimeString();
        li.innerHTML = `<span>${now}</span> <strong>${numbers.join(', ')}</strong>`;
        historyList.prepend(li);
        
        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    function getNumberColor(number) {
        if (number <= 10) return '#fbc400';
        if (number <= 20) return '#69c8f2';
        if (number <= 30) return '#ff7272';
        if (number <= 40) return '#aaa';
        return '#b0d840';
    }

    // Form Validation & Submission
    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(inquiryForm);
            
            fetch(inquiryForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    inquiryForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    setTimeout(() => {
                        inquiryForm.reset();
                        inquiryForm.style.display = 'block';
                        formSuccess.style.display = 'none';
                        submitBtn.textContent = 'Send Inquiry';
                        submitBtn.disabled = false;
                    }, 5000);
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert("Oops! There was a problem submitting your form");
                        }
                    });
                }
            })
            .catch(error => {
                alert("Oops! There was a problem submitting your form");
            })
            .finally(() => {
                submitBtn.textContent = 'Send Inquiry';
                submitBtn.disabled = false;
            });
        }
    });

    function validateForm() {
        let isValid = true;
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        
        if (nameInput.value.trim().length < 2) {
            document.getElementById('name-error').textContent = 'Name must be at least 2 characters.';
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address.';
            isValid = false;
        }
        
        if (messageInput.value.trim().length < 10) {
            document.getElementById('message-error').textContent = 'Message must be at least 10 characters.';
            isValid = false;
        }
        
        return isValid;
    }
});
