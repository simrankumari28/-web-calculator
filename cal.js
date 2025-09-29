// script.js

const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = calculator.querySelector('.calculator-screen');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false; // Flag to indicate if we are expecting the second number

keys.addEventListener('click', (event) => {
    const { target } = event;
    const { value } = target;

    // Exit if the click wasn't on a button
    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
            handleOperator(value);
            break;
        case '=':
            calculate();
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default:
            // Check if the value is a number (digit 0-9)
            if (!isNaN(parseFloat(value))) {
                inputDigit(value);
            }
    }
});

function inputDigit(digit) {
    const currentValue = display.value;

    if (waitingForSecondValue === true) {
        // Start a new number after an operator is pressed
        display.value = digit;
        waitingForSecondValue = false;
    } else {
        // Append to the current number, replacing '0' if it's the only thing there
        display.value = currentValue === '0' ? digit : currentValue + digit;
    }
}

function inputDecimal(dot) {
    // Start with '0.' if waiting for the second number
    if (waitingForSecondValue === true) {
        display.value = '0.';
        waitingForSecondValue = false;
        return;
    }

    // Prevent multiple decimals in one number
    if (!display.value.includes(dot)) {
        display.value += dot;
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.value);

    // If firstValue is null, store the current display value
    if (firstValue === null) {
        firstValue = inputValue;
    } else if (operator) {
        // If an operator is already set, calculate the result with the previous operator
        const result = performCalculation(firstValue, inputValue, operator);
        // Round to avoid floating point errors
        display.value = String(Math.round(result * 1000) / 1000); 
        firstValue = result; // Set the result as the new first value
    }

    waitingForSecondValue = true;
    operator = nextOperator; // Store the new operator
}

function performCalculation(val1, val2, op) {
    if (op === '+') return val1 + val2;
    if (op === '-') return val1 - val2;
    if (op === '*') return val1 * val2;
    if (op === '/') {
        if (val2 === 0) return 'Error'; // Division by zero error
        return val1 / val2;
    }
    return val2;
}

function calculate() {
    const inputValue = parseFloat(display.value);

    if (operator === null || waitingForSecondValue) {
        return; // Nothing to calculate
    }

    const result = performCalculation(firstValue, inputValue, operator);

    // Round for display and update state
    display.value = String(Math.round(result * 1000) / 1000);

    // Reset for the next operation sequence
    firstValue = result;
    operator = null;
    waitingForSecondValue = true;
}

function resetCalculator() {
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    display.value = '0';
}