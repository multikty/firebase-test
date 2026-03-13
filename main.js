document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers');
    const historyList = document.getElementById('history-list');
    const themeBtn = document.getElementById('theme-btn');
    const htmlElement = document.documentElement;

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
        
        if (historyList.children.length > 10) {
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
});
