
function calculateFormula(formula, data){

    // 校验是否为合法公式
    isValidFormula(formula, data)

    // 将表达式转换成逆波兰表达式
    const rpnExpression = toRPN(formula);
    console.log(rpnExpression)
    // 计算逆波兰表达式结果
    return evaluateRPN(rpnExpression,data);
}

function isValidFormula(formula, data){

    // 校验数据参数
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error('数据必须是一个非空对象');
    }

    // 校验公式参数
    if (typeof formula !== 'string') {
        throw new Error('公式必须是一个字符串');
    }
    if (!formula) {
        throw new Error('公式不能为空');
    }
    //是否包含无效字符
    const validTokens = /[a-zA-Z]|\+|-|\*|\/|\(|\)/g;
    const filteredFormula = formula.match(validTokens) || [];
    if (filteredFormula.join('') !== formula) {
        throw new Error('公式包含无效字符');
    }
    // 是否以操作符开头结尾
    if (/^\*|\/|\+|-/.test(formula) || /\*|\/|\+|-$/.test(formula)) {
        throw new Error('公式不能以操作符开头或结尾');
    }
    // 检查括号是否正确配对
    let balance = 0;
    for (let char of formula) {
        if (char === '(') balance++;
        if (char === ')') balance--;
        if (balance < 0) {
            throw new Error('括号未正确配对');
        }
    }
    if (balance !== 0) {
        throw new Error('括号未正确配对');
    }
    // 是否连续操作符
    if (/[+\-*/]{2,}/.test(formula)) {
        throw new Error('公式不能有连续的操作符');
    }
}

function toRPN(expression) {

    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };

    const tokens = expression.match(/[a-zA-Z]|\+|-|\*|\/|\(|\)/g);
    const output = [];
    const operator = [];

    for (let token of tokens) {
        if (/[a-zA-Z]/.test(token)) {
            output.push(token);
        } else if (token === '(') {
            operator.push(token);
        } else if (token === ')') {
            // 如果是右括号，循环输出，知道匹配到左括号为止
            while (operator[operator.length - 1] !== '(') {
                output.push(operator.pop());
            }
            operator.pop();
        } else {
            // 如果是运算符
            while (operator.length && operator[operator.length - 1] !== '('
            && precedence[token] <= precedence[operator[operator.length - 1]]) {
                output.push(operator.pop());
            }
            operator.push(token);
        }
    }

    while (operator.length) {
        output.push(operator.pop());
    }

    return output;
}

function evaluateRPN(tokens,data) {
    const stack = [];

    for (let token of tokens) {
        if (/[a-zA-Z]/.test(token)) {
            // 校验data中的键是否存在
            if (data[token] === undefined) {
                throw new Error(`数据中缺少 "${token}" 的值`);
            }
            stack.push(parseInt(data[token]));
        } else {
            const operand2 = stack.pop();
            const operand1 = stack.pop();
            switch (token) {
                case '+':
                    stack.push(operand1 + operand2);
                    break;
                case '-':
                    stack.push(operand1 - operand2);
                    break;
                case '*':
                    stack.push(operand1 * operand2);
                    break;
                case '/':
                    stack.push(operand1 / operand2);
                    break;
            }
        }
    }

    return stack.pop();
}

module.exports = calculateFormula;

// 测试示例
const expression = "a+(b+(c*a)/b) - (d-(c+e)/d)"
const variables = {a : -6, b : 5, c: 3, d: 4, e: 9}

console.log(calculateFormula(expression,variables));
