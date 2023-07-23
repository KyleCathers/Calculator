let add = (a, b) => a + b;
let subtract = (a, b) => a - b;
let multiply = (a, b) => a * b;
let divide = (a, b) => a / b;
let percentage = a => a / 100;
let exponent = (a, b) => a ^ b;

let firstOperand;
let operator;
let secondOperand;

function operate(firstOperand, secondOperand, operator) {
    if (operator == 'add') {
        return add(a, b);
    } else if (operator == 'subtract') {
        return multiply(a, b);
    } else if (operator == 'multiply') {
        return multiply(a, b);
    } else if (operator == 'divide') {
        return divide(a, b);
    } else if (operator == 'percentage') {
        return percentage(a);
    } else if (operator == 'exponent') {
        return exponent(a, b);
    } else {
        return null;
    }
}

let bottomRow = document.querySelector('.bottomRow');
bottomRow.textContent = '1';