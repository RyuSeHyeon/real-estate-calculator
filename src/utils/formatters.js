export const formatNumber = (num) => {
    if (!num) return '';
    return new Intl.NumberFormat('ko-KR').format(num);
};

export const evaluateExpression = (expr) => {
    try {
        const cleanExpr = expr.replace(/,/g, '').replace(/\s/g, '');
        if (!/^[0-9+\-*/().]+$/.test(cleanExpr)) {
            return NaN;
        }
        
        const tokens = cleanExpr.match(/[0-9.]+|[+\-*/()]/g) || [];
        const numbers = [];
        const operators = [];
        
        for (const token of tokens) {
            if (/[0-9.]+/.test(token)) {
                numbers.push(parseFloat(token));
            } else {
                operators.push(token);
            }
        }
        
        if (numbers.length === 0) return NaN;
        if (numbers.length === 1) return numbers[0];
        
        let result = numbers[0];
        for (let i = 0; i < operators.length; i++) {
            const nextNum = numbers[i + 1];
            switch (operators[i]) {
                case '+': result += nextNum; break;
                case '-': result -= nextNum; break;
                case '*': result *= nextNum; break;
                case '/': result /= nextNum; break;
                default: return NaN;
            }
        }
        
        return isFinite(result) ? result : NaN;
    } catch (error) {
        return NaN;
    }
};
