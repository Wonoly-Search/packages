const mathjs = require("mathjs");
const BUTTON_CLASS = `style="width: 100%;" class="flex items-center justify-center button__primary border border-black hover:border-black hover:bg-gray-50 rounded px-4 py-2 mr-2 mt-2 cursor-pointer flex font-bold text-black items-center justify-between"`;
const queries = [
    "calculator",
    "calculate",
    "calc",
    "calcu",
    "calcul",
    "calcula",
    "calculat",
];

class MathPackage {
    accepts(query) {
        const regexPhoneNumber =
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (query.match(regexPhoneNumber)) {
            return false;
        }
        query = query.toLowerCase();

        // TODO: multiple languages
        if (queries.indexOf(query) != -1) {
            return true;
        }

        if (!isNaN(query)) return false;
        try {
            //x and ⋅ are multiplication symbols not a letter x and decimal pointer(.)
            let result = query.replace(/×/gi, "*");
            result = result.replace(/⋅/gi, "*");
            result = result.replace(/÷/gi, "/");
            mathjs.evaluate(result);
            return true;
        } catch (error) {
            return false;
        }
    }

    async render(query) {
        let expression;
        let answer;
        if (
            query === "cal" ||
            query === "calc" ||
            query === "calcu" ||
            query === "calcul" ||
            query === "calcula" ||
            query === "calculat" ||
            query === "calculator"
        ) {
            expression = 0;
            answer = "";
        } else {
            try {
                //x and ⋅ are multiplication symbols not a letter x and decimal pointer(.)
                let result = query.replace(/×/gi, "*");
                result = result.replace(/⋅/gi, "*");
                result = result.replace(/÷/gi, "/");
                answer = mathjs.evaluate(result);
                expression = result;
            } catch (error) {
                return null;
            }
        }

        return new Promise(function (resolve, reject) {
            return resolve({
                html: `
                    <div id="wonoly__package__maths__wrapper">
                        <div class="w-full border border-black rounded font-bold flex items-end" style="flex-direction: column; font-size: 20px;" id="wonoly__package__math__output">
                            <div class="operation" style="font-size: 15px;">
                                <div class="value">${expression}</div>
                            </div>
                            <div class="result">
                                <div class="value">${answer}</div>
                            </div>
                        </div>
                        <div class="calculator_buttons">
                        </div>
                    </div>
                `,
                js: `

                    var CALCULATOR_ANS = 0;
                    var CALCULATOR_RAD = true;

                    const POWER = "POWER(";
                    const FACTORIAL = "FACTORIAL(";

                    // Maths function
                    class CalculatorFunctions {
                        static trigo(callback, angle) {
                            if (!CALCULATOR_RAD) {
                                angle = angle * Math.PI/100;
                            }

                            return callback(angle)
                        }

                        static inv_trigo(callback, value) {
                            let angle = callback(value);

                            if (!CALCULATOR_RAD) {
                                angle = angle * Math.PI/100
                            }

                            return angle;
                        }

                        // TODO: fix factorial
                        static factorial(number) {
                            if (number % 1 !== 0) return CalculatorFunctions.gamma(number + 1);
                            if (number === 0 || number === 1) return 1;

                            let result = 1;
                            for (let i = 0; i < number; i++) {
                                result *= i;
                                if (result === Infinity) return Infinity
                            }

                            return result;
                        }

                        static gamma(n) {  // accurate to about 15 decimal places
                            //some magic constants
                            var g = 7, // g represents the precision desired, p is the values of p[i] to plug into Lanczos' formula
                                p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
                            if(n < 0.5) {
                            return Math.PI / Math.sin(n * Math.PI) / gamma(1 - n);
                            }
                            else {
                            n--;
                            var x = p[0];
                            for(var i = 1; i < g + 2; i++) {
                                x += p[i] / (n + i);
                            }
                            var t = n + g + 0.5;
                            return Math.sqrt(2 * Math.PI) * Math.pow(t, (n + 0.5)) * Math.exp(-t) * x;
                            }
                        }
                    }

                    class Calculator {
                        constructor() {
                            this.buttons_per_row = 8;

                            this.data = {
                                operation: [ ${
                                    expression ? `"${expression}"` : ``
                                } ],
                                formula: [ ${answer ? `"${answer}"` : ``} ]
                            }

                            this.calculator_buttons = [
                                {
                                    name : "rad_deg",
                                    symbol : "<div class=\\"rad active\\">Rad</div><div style=\\"height: 1.5rem; width: 2px;\\" class=\\"bg-gray-400\\"></div><div class=\\"deg\\">Deg</div>",
                                    formula : false,
                                    type : "key"
                                },
                                {
                                    name : "rad_deg_replacement",
                                    symbol : "",
                                    formula : false,
                                    type : "key"
                                },
                                {
                                    name : "square-root",
                                    symbol : "√",
                                    formula : "Math.sqrt",
                                    type : "math_function"
                                },
                                {
                                    name : "square",
                                    symbol : "x²",
                                    formula : POWER,
                                    type : "math_function"
                                },
                                {
                                    name : "open-parenthesis",
                                    symbol : "(",
                                    formula : "(",
                                    type : "number"
                                },
                                {
                                    name : "close-parenthesis",
                                    symbol : ")",
                                    formula : ")",
                                    type : "number"
                                },
                                {
                                    name : "clear",
                                    symbol : "C",
                                    formula : false,
                                    type : "key"
                                },
                                {
                                    name : "delete",
                                    symbol : "⌫",
                                    formula : false,
                                    type : "key"
                                },
                                {
                                    name : "pi",
                                    symbol : "π",
                                    formula : "Math.PI",
                                    type : "number"
                                },
                                {
                                    name : "cos",
                                    symbol : "cos",
                                    formula : "CalculatorFunctions.trigo(Math.cos,",
                                    type : "trigo_function"
                                },{
                                    name : "sin",
                                    symbol : "sin",
                                    formula : "CalculatorFunctions.trigo(Math.sin,",
                                    type : "trigo_function"
                                },{
                                    name : "tan",
                                    symbol : "tan",
                                    formula : "CalculatorFunctions.trigo(Math.tan,",
                                    type : "trigo_function"
                                },{
                                    name : "n7",
                                    symbol : 7,
                                    formula : 7,
                                    type : "number"
                                },{
                                    name : "n8",
                                    symbol : 8,
                                    formula : 8,
                                    type : "number"
                                },{
                                    name : "n9",
                                    symbol : 9,
                                    formula : 9,
                                    type : "number"
                                },
                                {
                                    name : "division",
                                    symbol : "÷",
                                    formula : "/",
                                    type : "operator"
                                },
                                {
                                    name : "e",
                                    symbol : "e",
                                    formula : "Math.E",
                                    type : "number"
                                },
                                {
                                    name : "acos",
                                    symbol : "acos",
                                    formula : "CalculatorFunctions.inv_trigo(Math.acos,",
                                    type : "trigo_function"
                                },{
                                    name : "asin",
                                    symbol : "asin",
                                    formula : "CalculatorFunctions.inv_trigo(Math.asin,",
                                    type : "trigo_function"
                                },{
                                    name : "atan",
                                    symbol : "atan",
                                    formula : "CalculatorFunctions.inv_trigo(Math.atan,",
                                    type : "trigo_function"
                                },
                                {
                                    name : "n4",
                                    symbol : 4,
                                    formula : 4,
                                    type : "number"
                                },{
                                    name : "n5",
                                    symbol : 5,
                                    formula : 5,
                                    type : "number"
                                },{
                                    name : "n6",
                                    symbol : 6,
                                    formula : 6,
                                    type : "number"
                                },{
                                    name : "multiplication",
                                    symbol : "×",
                                    formula : "*",
                                    type : "operator"
                                },{
                                    name : "factorial",
                                    symbol : "×!",
                                    formula : FACTORIAL,
                                    type : "math_function"
                                },{
                                    name : "exp",
                                    symbol : "exp",
                                    formula : "Math.exp",
                                    type : "math_function"
                                },{
                                    name : "ln",
                                    symbol : "ln",
                                    formula : "Math.log",
                                    type : "math_function"
                                },{
                                    name : "log",
                                    symbol : "log",
                                    formula : "Math.log10",
                                    type : "math_function"
                                },{
                                    name : "n1",
                                    symbol : 1,
                                    formula : 1,
                                    type : "number"
                                },{
                                    name : "n2",
                                    symbol : 2,
                                    formula : 2,
                                    type : "number"
                                },{
                                    name : "n3",
                                    symbol : 3,
                                    formula : 3,
                                    type : "number"
                                },{
                                    name : "subtraction",
                                    symbol : "–",
                                    formula : "-",
                                    type : "operator"
                                },{
                                    name : "power",
                                    symbol : "<span>x<sup>y</sup></span>",
                                    formula : POWER,
                                    type : "math_function"
                                },{
                                    name : "ANS",
                                    symbol : "ANS",
                                    formula : "CALCULATOR_ANS",
                                    type : "number"
                                },{
                                    name : "percent",
                                    symbol : "%",
                                    formula : "/100",
                                    type : "number"
                                },{
                                    name : "comma",
                                    symbol : ".",
                                    formula : ".",
                                    type : "number"
                                },{
                                    name : "n0",
                                    symbol : 0,
                                    formula : 0,
                                    type : "number"
                                },{
                                    name : "calculate",
                                    symbol : "=",
                                    formula : "=",
                                    type : "calculate"
                                },{
                                    name : "addition",
                                    symbol : "+",
                                    formula : "+",
                                    type : "operator"
                                },
                            ];
                        }

                        create_buttons() {
                            let added_buttons = this.buttons_per_row; // This is for row creation
                            let buttons_space = document.querySelector("#wonoly__package__maths__wrapper .calculator_buttons");
                            for (const button of this.calculator_buttons) {
                                if ((added_buttons % this.buttons_per_row) === 0) {
                                    buttons_space.innerHTML += "<div class=\\"row flex items-center w-full\\"></div>"
                                }

                                added_buttons++;
                                let rows = document.querySelectorAll("#wonoly__package__maths__wrapper .calculator_buttons .row");
                                let row = rows[rows.length - 1]

                                row.innerHTML += \`
                                    <div ${BUTTON_CLASS} id="\${button.name}">\${button.symbol}</div>
                                \`
                            }
                        }

                        add_click_event() {
                            document.querySelector("#wonoly__package__maths__wrapper .calculator_buttons").addEventListener("click", (event) => {
                                const target_btn = event.target;

                                if (target_btn.classList.contains("deg")) {
                                    target_btn.classList.add("active");
                                    document.querySelector("#wonoly__package__maths__wrapper .calculator_buttons #rad_deg .rad").classList.remove("active");

                                    CALCULATOR_RAD = false;
                                } else if (target_btn.classList.contains("rad")) {
                                    target_btn.classList.add("active");
                                    document.querySelector("#wonoly__package__maths__wrapper .calculator_buttons #rad_deg .deg").classList.remove("active");

                                    CALCULATOR_RAD = true;
                                }


                                this.calculator_buttons.forEach( button => {
                                    if( button.name == target_btn.id ) this.calculate(button);
                                });
                            })
                        }

                        calculate(button) {
                            switch( button.type ) {
                                case "number":
                                case "operator": {
                                    this.data.formula.push(button.formula);
                                    this.data.operation.push(button.symbol);
                                    break;
                                }

                                case "key": {
                                    if (button.name === "clear") {
                                        this.data.operation = [];
                                        this.data.formula = [];

                                        this.updateOutputResult(0);
                                    } else if (button.name === "delete") {
                                        this.data.formula.pop();
                                        this.data.operation.pop();
                                    }

                                    break;
                                }

                                case "trigo_function": {
                                    this.data.operation.push(button.symbol + "(");
                                    this.data.formula.push(button.formula);
                                    break;
                                }

                                case "math_function": {
                                    let symbol, formula;

                                    switch (button.name) {
                                        case "factorial": {
                                            symbol = "!";
                                            formula = "factorial(";
                                            break;
                                        }

                                        case "power": {
                                            symbol = "^(";
                                            formula = button.formula;
                                            break;
                                        }

                                        case "square": {
                                            symbol = "^(";
                                            formula = button.formula;

                                            this.data.operation.push(symbol);
                                            this.data.formula.push(formula);
                                            break;
                                        }

                                        default: {
                                            symbol = button.symbol + "(";
                                            formula = button.formula + "(";
                                        }
                                    }

                                    if (button.name === "square") {
                                        this.data.operation.push("2)");
                                        this.data.formula.push("2)");
                                    } else {
                                        this.data.operation.push(symbol);
                                        this.data.formula.push(formula);
                                    }

                                    break;
                                }

                                case "calculate": {
                                    let result_joined = this.data.formula.join('');

                                    this.data.operation = [];
                                    this.data.formula = [];

                                    let result_final;
                                    try {
                                        result_final = eval(result_joined);
                                        CALCULATOR_ANS = result_final;
                                        this.updateOutputOperation("");

                                    } catch (error) {
                                        if (error instanceof SyntaxError) {
                                            result_final = "Syntax Error!"
                                            this.updateOutputResult( result_final );
                                            return;
                                        } else {
                                            result_final = "Math Error!"
                                            this.updateOutputResult( result_final );
                                            return;
                                        }
                                    }

                                    this.updateOutputResult( result_final );
                                    return;
                                }
                            }

                            this.updateOutputOperation(this.data.operation.join(''))
                        }

                        updateOutputOperation(result){
                            document.querySelector("#wonoly__package__math__output .operation .value").innerHTML = result;
                        }

                        updateOutputResult(result){
                            document.querySelector("#wonoly__package__math__output .result .value").innerHTML = result;
                        }
                    }

                    // Initialization
                    let calculator = new Calculator();
                    calculator.create_buttons();
                    calculator.add_click_event();

                `,
                css: `

                    #wonoly__package__maths__wrapper .calculator_buttons #rad_deg_replacement {
                        display: none;
                    }

                    #wonoly__package__maths__wrapper .calculator_buttons #rad_deg .deg,
                    #wonoly__package__maths__wrapper .calculator_buttons #rad_deg .rad {
                        opacity: .5;
                    }

                    #wonoly__package__maths__wrapper .calculator_buttons #rad_deg .deg.active,
                    #wonoly__package__maths__wrapper .calculator_buttons #rad_deg .rad.active {
                        opacity: 1;
                    }

                    #wonoly__package__maths__wrapper .calculator_buttons #rad_deg,
                    #wonoly__package__maths__wrapper .calculator_buttons #calculate {
                        width: 300% !important;
                    }

                    #wonoly__package__maths__wrapper .calculator_buttons .row div:last-child {
                        margin-right: 0;
                    }

                    #wonoly__package__maths__wrapper .calculator_buttons #multiplication,
                    #wonoly__package__maths__wrapper .calculator_buttons #subtraction,
                    #wonoly__package__maths__wrapper .calculator_buttons #calculate,
                    #wonoly__package__maths__wrapper .calculator_buttons #division,
                    #wonoly__package__maths__wrapper .calculator_buttons #addition {
                        background: #000;
                        color: #fff;
                    }

                    #wonoly__package__maths__wrapper .calculator_buttons #multiplication:hover,
                    #wonoly__package__maths__wrapper .calculator_buttons #subtraction:hover,
                    #wonoly__package__maths__wrapper .calculator_buttons #calculate:hover,
                    #wonoly__package__maths__wrapper .calculator_buttons #division:hover,
                    #wonoly__package__maths__wrapper .calculator_buttons #addition:hover {
                        background: #fff;
                        color: #000;
                    }

                    #wonoly__package__maths__wrapper .calculator_buttons #n0,
                    #wonoly__package__maths__wrapper .calculator_buttons #n1,
                    #wonoly__package__maths__wrapper .calculator_buttons #n2,
                    #wonoly__package__maths__wrapper .calculator_buttons #n3,
                    #wonoly__package__maths__wrapper .calculator_buttons #n4,
                    #wonoly__package__maths__wrapper .calculator_buttons #n5,
                    #wonoly__package__maths__wrapper .calculator_buttons #n6,
                    #wonoly__package__maths__wrapper .calculator_buttons #n7,
                    #wonoly__package__maths__wrapper .calculator_buttons #n8,
                    #wonoly__package__maths__wrapper .calculator_buttons #n9
                    {
                        background: rgba(0,0,0,.1);
                    }

                    #wonoly__package__maths__wrapper .operation {
                        padding: 10px 10px 0 10px;
                        opacity: .5;
                    }

                    #wonoly__package__maths__wrapper .result {
                        padding: 0 10px 10px 10px;
                    }
                `,
            });
        });
    }

    info() {
        return {
            title: "Calculator",
            description:
                "A pretty simple calculator, but it's nicely designed and easy to use. You can add, subtract, multiply, and divide (of course), but there are also basic trigonometric, logarithmic, and exponential functions.",
            author: "Mauro Baladés",
            version: "1.0.1",
        };
    }
}

module.exports.default = MathPackage;
