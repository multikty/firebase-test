
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers');
    const historyList = document.getElementById('history-list');

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
            }, index * 200); 
        });
    }

    function addToHistory(numbers) {
        const listItem = document.createElement('li');
        listItem.textContent = numbers.join(', ');
        historyList.prepend(listItem);
    }

    function getNumberColor(number) {
        if (number <= 10) return '#fbc400'; 
        if (number <= 20) return '#69c8f2'; 
        if (number <= 30) return '#ff7272'; 
        if (number <= 40) return '#aaa'; 
        return '#b0d840'; 
    }
});
