const valueDisplay = document.getElementById("value-display");
const resultDisplay = document.getElementById("result-display");
const buttons = document.querySelectorAll("button");

let expression = "";
let justEvaluated = false;
let lastAnswer = 0;

/* ---------------- Factorial Function ---------------- */
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    return Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
}

/* ---------------- Helpers ---------------- */
function clearAll() {
    expression = "";
    valueDisplay.innerText = "";
    resultDisplay.innerText = "";
    justEvaluated = false;
}

function deleteLast() {
    expression = expression.slice(0, -1);
    valueDisplay.innerText = expression;
}

function updateDisplay() {
    valueDisplay.innerText = expression;
}

/* ---------------- Expression Evaluation ---------------- */
function evaluateExpression() {
    try {
        // Operator replacements
        const replacements = {
            "√": "Math.sqrt",
            "\\^": "**",
            "π": "Math.PI",
            "\\be\\b": "Math.E",       // exact 'e' only
            "exp\\(": "Math.exp(",
            "sin\\(": "Math.sin((Math.PI/180)*",
            "cos\\(": "Math.cos((Math.PI/180)*",
            "tan\\(": "Math.tan((Math.PI/180)*",
            "log\\(": "Math.log10(",
            "ln\\(": "Math.log(",
            "mod": "%",
            "Ans": lastAnswer
        };

        let exp = expression;

        // Apply all replacements
        for (const [pattern, replacement] of Object.entries(replacements)) {
            exp = exp.replace(new RegExp(pattern, "g"), replacement);
        }

        // Handle factorial
        exp = exp.replace(/(\d+)!/g, "factorial($1)");

        // Evaluate safely
        let result = eval(exp);

        if (Number.isFinite(result)) {
            resultDisplay.innerText = +result.toFixed(6);
            lastAnswer = result;
        } else {
            resultDisplay.innerText = "Error";
            lastAnswer = 0;
        }
        justEvaluated = true;
    } catch {
        resultDisplay.innerText = "Error";
        justEvaluated = true;
    }
}

/* ---------------- Button Click Handling ---------------- */
function handleButtonClick(val) {
    // Reset if typing after evaluation
    if (justEvaluated && !["=", "C", "DEL", "Ans"].includes(val)) {
        clearAll();
    }

    switch (val) {
        case "C":
            clearAll();
            break;
        case "DEL":
            deleteLast();
            break;
        case "=":
            evaluateExpression();
            break;
        case "( )":
            expression += "()";
            updateDisplay();
            break;
        case "Ans":
            expression += "Ans";
            updateDisplay();
            break;
        case "!":
            expression += "!";
            updateDisplay();
            break;
        case ".":
            // Prevent multiple decimals in the same number
            let lastNumber = expression.split(/[^0-9.]/).pop(); 
            if (lastNumber.includes(".")) return; // ignore extra dot
            expression += ".";
            updateDisplay();
            break;
        case "sin":
        case "cos":
        case "tan":
        case "asin":
        case "acos":
        case "atan":
        case "log":
        case "ln":
        case "exp":
            expression += val + "(";
            updateDisplay();
            break;
        default:
            expression += val;
            updateDisplay();
            break;
    }
}

/* ---------------- Attach Event Listeners ---------------- */
buttons.forEach(button => {
    button.addEventListener("click", () => handleButtonClick(button.innerText));
});
