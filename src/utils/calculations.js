// 중개수수료 요율 계산
export const calculateBrokerageRate = (amount, type) => {
    const amountInWon = amount * 10000;
    if (type === 'sale') {
        if (amountInWon < 50000000) return 0.006;
        if (amountInWon < 200000000) return 0.005;
        if (amountInWon < 900000000) return 0.004;
        if (amountInWon < 1200000000) return 0.005;
        if (amountInWon < 1500000000) return 0.006;
        return 0.007;
    } else {
        if (amountInWon < 50000000) return 0.004;
        if (amountInWon < 100000000) return 0.004;
        if (amountInWon < 600000000) return 0.003;
        if (amountInWon < 1200000000) return 0.004;
        if (amountInWon < 1500000000) return 0.005;
        return 0.006;
    }
};

// 중개수수료 계산
export const calculateBrokerageFee = (amount, type) => {
    const amountInWon = amount * 10000;
    if (type === 'sale') {
        if (amountInWon < 50000000) return Math.min(amountInWon * 0.006, 250000);
        if (amountInWon < 200000000) return Math.min(amountInWon * 0.005, 800000);
        if (amountInWon < 900000000) return amountInWon * 0.004;
        if (amountInWon < 1200000000) return amountInWon * 0.005;
        if (amountInWon < 1500000000) return amountInWon * 0.006;
        return amountInWon * 0.007;
    } else {
        if (amountInWon < 50000000) return Math.min(amountInWon * 0.004, 200000);
        if (amountInWon < 100000000) return Math.min(amountInWon * 0.004, 300000);
        if (amountInWon < 600000000) return amountInWon * 0.003;
        if (amountInWon < 1200000000) return amountInWon * 0.004;
        if (amountInWon < 1500000000) return amountInWon * 0.005;
        return amountInWon * 0.006;
    }
};