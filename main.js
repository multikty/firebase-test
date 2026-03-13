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
        themeBtn.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
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
        const now = new Date().toLocaleTimeString('ko-KR');
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
            submitBtn.textContent = '전송 중...';
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
                        submitBtn.textContent = '문의 보내기';
                        submitBtn.disabled = false;
                    }, 5000);
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert("오류가 발생했습니다. 다시 시도해 주세요.");
                        }
                    });
                }
            })
            .catch(error => {
                alert("오류가 발생했습니다. 다시 시도해 주세요.");
            })
            .finally(() => {
                submitBtn.textContent = '문의 보내기';
                submitBtn.disabled = false;
            });
        }
    });

    function validateForm() {
        let isValid = true;
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        
        if (nameInput.value.trim().length < 2) {
            document.getElementById('name-error').textContent = '이름은 최소 2자 이상이어야 합니다.';
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            document.getElementById('email-error').textContent = '유효한 이메일 주소를 입력해 주세요.';
            isValid = false;
        }
        
        if (messageInput.value.trim().length < 10) {
            document.getElementById('message-error').textContent = '문의 내용은 최소 10자 이상이어야 합니다.';
            isValid = false;
        }
        
        return isValid;
    }
});
