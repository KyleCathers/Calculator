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
        firstOperand = firstOperand.slice(0, -1);
        buttonPressed();
    } else if (state == 3) {
        secondOperand = secondOperand.slice(0, -1);
        buttonPressed();
    } else if (state == 4) {
        // only on non-exponential numbers
        if(result.toString().indexOf("e+") == -1) {
            result = result.slice(0, -1);
            buttonPressed();
        }
    }
})

plusMinusButton.addEventListener('click', () => {
    plusMinusPressed();
})

function operatorPressed(operatorInput) {
    if (state == 1) {
        state = 2;
        operator = operatorInput;
        buttonPressed();
    } else if (state == 2) {
        operator = operatorInput;
        buttonPressed();
    } else if (state == 4) {
        state = 2;
        operator = operatorInput;
        firstOperand = result;
        secondOperand = '';
        buttonPressed();
    }
}

function equalsPressed() {
    if (state == 3) {
        state = 4;
        result = formatNumber(operate(Number(firstOperand), Number(secondOperand), operator).toString());
        buttonPressed();
    } else if (state == 'Overflow') {
        buttonPressed();
    }
}

function numberPressed(number) {
    if (state == 0) {
        state = 1;
        firstOperand += number;
        buttonPressed();
    } else if (state == 1) {
        if (firstOperand.length < 9) {
            firstOperand += number;
        }
        buttonPressed();
    } else if (state == 2) {
        state = 3;
        secondOperand += number;
        buttonPressed();
    } else if (state == 3) {
        if ((secondOperand.length < 9) & ((firstOperand + operator + secondOperand).length < 14)) {
            secondOperand += number;
        }
        buttonPressed();
    } else if (state == 4) {
        buttonPressed(); // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
}

function plusMinusPressed() {
    if (state == 1) {
        firstOperand = -firstOperand;
    } else if (state == 3) {
        secondOperand = -secondOperand;
    } else if (state == 4) {
        result = -result;
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