// state variables
let firstOperand = '';
let operator = '';
let secondOperand = '';
let result = 0;
let state = 0;
let operandHasDecimal = 0;

// screen
let screenBottomRow = document.querySelector('.bottomRow');
let screenTopRow = document.querySelector('.topRow');

// 0-9 keys
const buttons = [];

for (let i = 0; i <= 9; i++) {
    buttons[i] = document.querySelector("#button" + i);
    buttons[i].addEventListener('click', () => { 
        numberPressed(i.toString());
    });
}

// other buttons
let decimalButton = document.querySelector('#decimal');
let addButton = document.querySelector('#add');
let subtractButton = document.querySelector('#subtract');
let multiplyButton = document.querySelector('#multiply');
let divideButton = document.querySelector('#divide');
let equalsButton = document.querySelector('#equals');
let plusMinusButton = document.querySelector('#plusMinus');
let clearButton = document.querySelector('#clear');
let backspaceButton = document.querySelector('#backspace');

clearButton.addEventListener('click', () => {
    state = 0;
    buttonPressed();
});

decimalButton.addEventListener('click', () => {
    if (operandHasDecimal == 0){ // only 1 decimal per operand
        operandHasDecimal = 1;
        numberPressed('.');
    }
});

addButton.addEventListener('click', () => {
    operatorPressed('+');
})

subtractButton.addEventListener('click', () => {
    operatorPressed('-');
})

multiplyButton.addEventListener('click', () => {
    operatorPressed('x');
})

divideButton.addEventListener('click', () => {
    operatorPressed('/');
})

equalsButton.addEventListener('click', () => {
    equalsPressed();
})

backspaceButton.addEventListener('click', () => {
    if (state == 1) {
        if (firstOperand == 'NaN' || firstOperand == 'Infinity') {
            firstOperand = '';
        }
        firstOperand = firstOperand.slice(0, -1);
    } else if (state == 3) {
        if (secondOperand == 'NaN' || secondOperand == 'Infinity') {
            secondOperand = '';
        }
        secondOperand = secondOperand.slice(0, -1);
    } else if (state == 4) {
        // only on non-exponential numbers
        if (result == 'NaN' || result == 'Infinity') {
            result = '';
        }
        if(result.toString().indexOf("e+") == -1) {
            result = result.slice(0, -1);
        }
    }
    buttonPressed();
})

plusMinusButton.addEventListener('click', () => {
    plusMinusPressed();
})

function operatorPressed(operatorInput) { 
    if(result == '-') { // handle behavior with plus minus button and backspace
        result = '0';
    }
    if(firstOperand == '-') {
        firstOperand = '0';
    }
    if(secondOperand == '-') {
        secondOperand = '0';
    }

    if (state == 1) {
        state = 2;
        operator = operatorInput;
    } else if (state == 2) {
        operator = operatorInput;
    } else if (state == 3) { // e.g. 3x3 then x again -> goes to 9 x ... skipping state 4
        result = formatNumber(operate(Number(firstOperand), Number(secondOperand), operator).toString());
        state = 2;
        operator = operatorInput;
        firstOperand = result;
        secondOperand = '';
    } else if (state == 4) {
        state = 2;
        operator = operatorInput;
        firstOperand = result;
        secondOperand = '';
    }
    buttonPressed();
}

function equalsPressed() {
    if (state == 3) {
        state = 4;
        result = formatNumber(operate(Number(firstOperand), Number(secondOperand), operator).toString());
        buttonPressed();
    }
}

function numberPressed(number) {
    if (state == 0) {           // check for leading 0s
        state = 1;
        firstOperand += number;
    } else if (state == 1) {    // bottom row length, check for leading 0s
        if (firstOperand.length < 9) {
            firstOperand += number;
        }
    } else if (state == 2) {
        state = 3;  
        secondOperand += number;
    } else if (state == 3) {    // bottom row length, top row length, check for leading 0s
        if ((secondOperand.length < 9) & ((firstOperand + operator + secondOperand).length < 14)) {
            secondOperand += number;
        }
    } else if (state == 4) {
        if (result.length < 9) {
            result += number;
        }
    }
    buttonPressed();
}

function plusMinusPressed() {
    if (state == 1) {
        firstOperand = (-firstOperand).toString();
    } else if (state == 3) {
        secondOperand = (-secondOperand).toString();
    } else if (state == 4) {
        result = (-result).toString();
    }
    buttonPressed();
}

// FSM
function buttonPressed() {
    if (state == 0) {                           // cleared state
        clearState();
    } else if (state == 1) {                    // first operand state
        screenBottomRow.innerHTML = firstOperand;
        screenTopRow.innerHTML = firstOperand;
    } else if (state == 2) {                    // operator state
        operandHasDecimal = 0;
        if (firstOperand == '') {
            firstOperand = 0;
        }
        screenTopRow.innerHTML = firstOperand + operator;
    } else if (state == 3) {                    // second operand state
        screenTopRow.innerHTML = firstOperand + operator + secondOperand;
        screenBottomRow.innerHTML = secondOperand;
    } else if (state == 4) {
        screenTopRow.innerHTML = firstOperand + operator + secondOperand + '=';
        screenBottomRow.innerHTML = result;
    }
    console.log(`state: ${state}, operand1: ${firstOperand}, operator: ${operator}, operand2: ${secondOperand}, result = ${result}`);
}

function formatNumber(strNumber) {
    if (strNumber.length > 9) {
        if (strNumber % 1 != 0) {   // floating point number with decimal
            while(strNumber.length > 9) { // chop off 1 decimal until it fits
                strNumber = strNumber.slice(0, -1);
            }
        } else {                    // convert large numbers to exponential
            strNumber = Number.parseFloat(strNumber).toExponential(2);
        }

    }
    return strNumber;
}

function operate(a, b, operator) {
    if (operator == '+') {
        return a + b;
    } else if (operator == '-') {
        return a - b;
    } else if (operator == 'x') {
        return a * b;
    } else if (operator == '/') {
        return a/b;
    } else {
        return null;
    }
}

function clearState() {
    firstOperand = '';
    operator = '';
    secondOperand = '';
    operandHasDecimal = 0;
    screenTopRow.innerHTML = '';
    screenBottomRow.innerHTML = '';
}

buttonPressed();