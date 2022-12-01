const inputField = document.querySelector('.field');
const btns = document.querySelectorAll('.btn');


const doСalculations = (example, currentEntire) => {
  let calculate = 0;
  // Беремо слайс з виразу, оператор та два значення
  if (currentEntire.indexOfPrevOperator) {
    sliceExample = example.slice(currentEntire.indexOfPrevOperator + 1, currentEntire.indexOfNextOperator);
  } else {
    sliceExample = example.slice(currentEntire.indexOfPrevOperator, currentEntire.indexOfNextOperator);
  }
  // Розділяємо значення відносно оператора
  splitSlice = sliceExample.split(currentEntire.operator);
  // Прибираємо дужки
  splitSlice = splitSlice.map(element => element.replaceAll('(', '').replaceAll(')', ''));

  // Знаходимо значення нашого slic`у
  switch (currentEntire.operator) {
    case '^':
      calculate = Number(splitSlice[0]) ** Number(splitSlice[1]);
      break;
    case '*':
      calculate = Number(splitSlice[0]) * Number(splitSlice[1]);
      break;
    case '/':
      calculate = Number(splitSlice[0]) / Number(splitSlice[1]);
      break;
    case '+':
      calculate = Number(splitSlice[0]) + Number(splitSlice[1]);
      break;
    case '-':
      calculate = Number(splitSlice[0]) - Number(splitSlice[1]);
  }

  // Якщо значення получилося від'ємним - ставимо дужки
  if (calculate < 0) {
    calculate = `(${calculate})`;
  }
  return example.replace(sliceExample, String(calculate));
};

const sortArray = (indexsAndSymbols) => {
  // Сортуємо список операторів, починаючи з тих у яких найбільший пріорітет
  let temp;
  for (let i = 0; i < indexsAndSymbols.length; i++) {
    for (let j = 0; j < indexsAndSymbols.length - i - 1; j++) {
      if (indexsAndSymbols[j].prioritetOfOperator < indexsAndSymbols[j + 1].prioritetOfOperator) {
        temp = indexsAndSymbols[j];
        indexsAndSymbols[j] = indexsAndSymbols[j + 1];
        indexsAndSymbols[j + 1] = temp;
      }
    }
  }
  return indexsAndSymbols;
};

const parseOperators = (example, prioritets) => {
  let arrayOfSymbols = [];
  let indexOfSymbol = 0;

  for (let i = 0; i < example.length; i++) {
    // Парсимо оператори та їх пріорітети
    let currentOperator = example[i];
    if (Object.keys(prioritets).includes(currentOperator) && example[i - 1] !== '(') {
      arrayOfSymbols.push({
        indexOfOperator: indexOfSymbol,
        operator: currentOperator,
        prioritetOfOperator: prioritets[currentOperator]
      });
    }
    indexOfSymbol += 1;
  }

  for (const entire of arrayOfSymbols) {
    let indexOfEntire = arrayOfSymbols.indexOf(entire);
    // Для кожного оператора знаходимо минулий та наступний, щоб потім зробити slice
    if (indexOfEntire === 0 && arrayOfSymbols.length > 1) {
      entire.indexOfPrevOperator = 0;
      entire.indexOfNextOperator = arrayOfSymbols[indexOfEntire + 1].indexOfOperator;
    } else if (indexOfEntire === 0 && arrayOfSymbols.length === 1) {
      entire.indexOfPrevOperator = 0;
      entire.indexOfNextOperator = example.length;
    } else if (indexOfEntire === arrayOfSymbols.length - 1) {
      entire.indexOfPrevOperator = arrayOfSymbols[indexOfEntire - 1].indexOfOperator;
      entire.indexOfNextOperator = example.length;
    } else {
      entire.indexOfPrevOperator = arrayOfSymbols[indexOfEntire - 1].indexOfOperator;
      entire.indexOfNextOperator = arrayOfSymbols[indexOfEntire + 1].indexOfOperator;
    }
  }
  // Зортуємо список
  arrayOfSymbols = sortArray(arrayOfSymbols);
  return arrayOfSymbols;
};

const parseExample = (example) => {

  let calculations = example.slice(0, -1);
  const prioritets = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3,
  };

  let indexsAndSymbols = parseOperators(calculations, prioritets);
  let arrayLength = indexsAndSymbols.length;

  for (let i = 0; i < arrayLength; i++) {
    // Вичисляємо значення
    calculations = doСalculations(calculations, indexsAndSymbols[0]);
    // Парсимо оператори, які залишилися
    indexsAndSymbols = parseOperators(calculations, prioritets);
  }
  // Прибираємо скобки якщо результат від'ємний
  calculations = calculations.replace('(', '').replace(')', '');
  return calculations;
};

const handleButton = (btn) => {
  // Вичисляємо кнопку, що була натиснута
  let currentButton = btn.textContent;
  let prevSymbol = '';
  let condition = prevSymbol === currentButton && ['-', '+', '*', '/', '^'].includes(prevSymbol) || ['-', '+', '*', '/', '^'].includes(prevSymbol) && ['-', '+', '*', '/', '^'].includes(currentButton);
  if (currentButton !== 'Del' && currentButton !== 'C' && !(condition)) {
    inputField.value += currentButton;
    prevSymbol = currentButton;
  }

  if (currentButton === 'C') {
    inputField.value = '';
  }

  if (currentButton === 'Del') {
    inputField.value = inputField.value.slice(0, -1);
  }

  if (currentButton === '=' && inputField.value !== '') {
    inputField.value = parseExample(inputField.value);
  }

};

btns.forEach(btn => {
  btn.addEventListener('click', () => handleButton(btn));
});
