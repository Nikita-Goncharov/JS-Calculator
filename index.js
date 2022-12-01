const inputField = document.querySelector('.field');
const btns = document.querySelectorAll('.btn');

let prevSymbol = '';


const doСalculations = (example, currentEntire) => {
  let calculate = 0;
  console.log(currentEntire);
  if (currentEntire.indexOfPrevOperator) {
    sliceExample = example.slice(currentEntire.indexOfPrevOperator+1, currentEntire.indexOfNextOperator);
  } else {
    sliceExample = example.slice(currentEntire.indexOfPrevOperator, currentEntire.indexOfNextOperator);
  }
  splitSlice = sliceExample.split(currentEntire.operator);
  
  splitSlice = splitSlice.map(element => element.replaceAll('(', '').replaceAll(')', ''));
  console.log(sliceExample, splitSlice);
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
  console.log(calculate);
  if (calculate < 0) {
    calculate = `(${calculate})`;
  }
  return example.replace(sliceExample, String(calculate));
};



const sortArray = (indexsAndSymbols) => {
  let temp;
  for (let i = 0; i < indexsAndSymbols.length; i++) {
    for (let j = 0; j < indexsAndSymbols.length - i - 1; j++) {
      if (indexsAndSymbols[j].prioritetOfOperator < indexsAndSymbols[j+1].prioritetOfOperator) {
        temp = indexsAndSymbols[j];
        indexsAndSymbols[j] = indexsAndSymbols[j+1];
        indexsAndSymbols[j+1] = temp;
      }
    }
  }
  return indexsAndSymbols;
};


const parseOperators = (example, prioritets) => {
  let arrayOfSymbols = [];
  let indexOfSymbol = 0;

  for (let i = 0; i < example.length; i++) {
      let currentOperator = example[i];
      if (Object.keys(prioritets).includes(currentOperator) && example[i-1] !== '(') {
            arrayOfSymbols.push({indexOfOperator: indexOfSymbol, operator: currentOperator, prioritetOfOperator: prioritets[currentOperator]});
      }
      indexOfSymbol += 1;
  }

  for (const entire of arrayOfSymbols) {
    let indexOfEntire = arrayOfSymbols.indexOf(entire);

    if (indexOfEntire === 0 && arrayOfSymbols.length > 1) {
      entire.indexOfPrevOperator = 0;
      entire.indexOfNextOperator = arrayOfSymbols[indexOfEntire+1].indexOfOperator;
    } else if (indexOfEntire === 0 && arrayOfSymbols.length === 1) {
      entire.indexOfPrevOperator = 0;
      entire.indexOfNextOperator = example.length;
    } else if (indexOfEntire === arrayOfSymbols.length-1) {
      entire.indexOfPrevOperator = arrayOfSymbols[indexOfEntire-1].indexOfOperator;
      entire.indexOfNextOperator = example.length;
    } else {
      entire.indexOfPrevOperator = arrayOfSymbols[indexOfEntire-1].indexOfOperator;
      entire.indexOfNextOperator = arrayOfSymbols[indexOfEntire+1].indexOfOperator;
    }
  }

  arrayOfSymbols = sortArray(arrayOfSymbols);


  return arrayOfSymbols;
};


// 2^3+8574/856-96+7+8/4

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
    let arrayCopy = indexsAndSymbols;
    console.log(indexsAndSymbols);

    for (let i = 0; i < arrayCopy.length; i++) {

      calculations = doСalculations(calculations, indexsAndSymbols[0]);
      indexsAndSymbols = parseOperators(calculations, prioritets);
    }
    
    return calculations;
};

const handleButton = (btn) => {
    let currentButton = btn.textContent;
    let condition = prevSymbol ===  currentButton && ['-', '+', '*', '/', '^'].includes(prevSymbol) || ['-', '+', '*', '/', '^'].includes(prevSymbol) && ['-', '+', '*', '/', '^'].includes(currentButton);
    if (currentButton !== 'Del' && currentButton !== 'C' && !(condition)) {
        inputField.value +=  currentButton;
        prevSymbol =  currentButton;
    }

    if ( currentButton === 'C') {
        inputField.value = '';
    }

    if ( currentButton === 'Del') {
        inputField.value = inputField.value.slice(0, -1);
    }

    if( currentButton === '=' && inputField.value !== '') {
        inputField.value = parseExample(inputField.value);
    }

};


btns.forEach(btn => {
    btn.addEventListener('click', () => handleButton(btn));
});
