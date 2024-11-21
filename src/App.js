import { useState, useEffect } from 'react';
import { Calculator, Save, RotateCcw } from 'lucide-react';

const EnhancedRealEstateCalculator = () => {
    // 숫자 포맷팅 함수
    const formatNumber = (num) => {
        if (!num) return '';
        return new Intl.NumberFormat('ko-KR').format(num);
    };

    // values 초기화
    const [values, setValues] = useState(() => {
        try {
            const savedValues = localStorage.getItem('realEstateCalcValues');
            return savedValues ? JSON.parse(savedValues) : {
                currentProperty: '',
                bankLoan: '',
                savings: '',
                newProperty: '',
                ltvRatio: 80,
            };
        } catch (error) {
            return {
                currentProperty: '',
                bankLoan: '',
                savings: '',
                newProperty: '',
                ltvRatio: 80,
            };
        }
    });

    // displayValues 초기화
    const [displayValues, setDisplayValues] = useState(() => {
        try {
            const savedValues = localStorage.getItem('realEstateCalcValues');
            if (savedValues) {
                const parsed = JSON.parse(savedValues);
                return {
                    currentProperty: parsed.currentProperty ? formatNumber(parsed.currentProperty) : '',
                    bankLoan: parsed.bankLoan ? formatNumber(parsed.bankLoan) : '',
                    savings: parsed.savings ? formatNumber(parsed.savings) : '',
                    newProperty: parsed.newProperty ? formatNumber(parsed.newProperty) : '',
                };
            }
        } catch (error) {
            // 에러 발생 시 빈 값으로 초기화
        }
        return {
            currentProperty: '',
            bankLoan: '',
            savings: '',
            newProperty: '',
        };
    });

    const [results, setResults] = useState({
        currentAssets: 0,
        requiredDownPayment: 0,
        totalRequired: 0,
        finalRequired: 0,
    });

    // 추가된 state들
    const [transactionType, setTransactionType] = useState('sale');
    const [region, setRegion] = useState('normal');
    const [isFirstTime, setIsFirstTime] = useState(false);
    // 상태 추가 (컴포넌트 최상단 상태 선언부에 추가)
    const [isResultVisible, setIsResultVisible] = useState(true);


    // 중개수수료 요율 계산 함수
    const calculateBrokerageRate = (amount, type) => {
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

    // 중개수수료 계산 함수
    const calculateBrokerageFee = (amount, type) => {
        const amountInWon = amount * 10000;
        if (type === 'sale') { // 매매
            if (amountInWon < 50000000) return Math.min(amountInWon * 0.006, 250000);
            if (amountInWon < 200000000) return Math.min(amountInWon * 0.005, 800000);
            if (amountInWon < 900000000) return amountInWon * 0.004;
            if (amountInWon < 1200000000) return amountInWon * 0.005;
            if (amountInWon < 1500000000) return amountInWon * 0.006;
            return amountInWon * 0.007;
        } else { // 임대차
            if (amountInWon < 50000000) return Math.min(amountInWon * 0.004, 200000);
            if (amountInWon < 100000000) return Math.min(amountInWon * 0.004, 300000);
            if (amountInWon < 600000000) return amountInWon * 0.003;
            if (amountInWon < 1200000000) return amountInWon * 0.004;
            if (amountInWon < 1500000000) return amountInWon * 0.005;
            return amountInWon * 0.006;
        }
    };

    // 취득세 계산 함수 (2024년 남양주시 기준)
    const calculateAcquisitionTax = (amount, isFirstTime, region, type) => {
        // 전세인 경우 0원 반환
        if (type === 'rent') return 0;

        const amountInWon = amount * 10000;
        let baseRate = 0.04; // 기본 취득세율 4%
        let surtaxRate = 0.002; // 지방교육세 0.2%
        let specialTax = 0.002; // 농어촌특별세 0.2%

        // 생애최초 구입 감면 (남양주시 기준)
        if (isFirstTime) {
            if (amountInWon <= 300000000) { // 3억 이하
                baseRate = 0.01; // 1%
                surtaxRate = 0;
                specialTax = 0;
            } else if (amountInWon <= 500000000) { // 5억 이하
                baseRate = 0.02; // 2%
                surtaxRate = 0.001;
                specialTax = 0;
            }
        }

        // 투기과열지구 추가세율
        if (region === 'speculative') {
            if (amountInWon > 300000000) {
                baseRate += 0.01;
            }
        }

        return amountInWon * (baseRate + surtaxRate + specialTax);
    };

    // 취득세 계산식 문자열 생성 함수
    const getTaxFormula = (amount, isFirstTime, region, type) => {
        if (type === 'rent') return '전세는 취득세 면제';

        const amountInWon = amount * 10000;
        let formula = '';

        if (isFirstTime) {
            if (amountInWon <= 300000000) {
                formula = '생애최초 3억이하 (1%)';
            } else if (amountInWon <= 500000000) {
                formula = '생애최초 5억이하 (2% + 지방교육세 0.1%)';
            } else {
                formula = '생애최초 5억초과 (4% + 지방교육세 0.2% + 농특세 0.2%)';
            }
        } else {
            formula = '일반세율 (4% + 지방교육세 0.2% + 농특세 0.2%)';
        }

        if (region === 'speculative' && amountInWon > 300000000) {
            formula += ' + 투기과열지구 할증 1%';
        }

        return formula;
    };

    // 문자열 수식 계산 (안전한 버전)
    const evaluateExpression = (expr) => {
        try {
            const cleanExpr = expr.replace(/,/g, '').replace(/\s/g, '');
            if (!/^[0-9+\-*/().]+$/.test(cleanExpr)) {
                return NaN;
            }

            // 간단한 사칙연산만 직접 처리
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

    // 입력값 처리
    const handleInputChange = (name, value) => {
        setDisplayValues(prev => ({
            ...prev,
            [name]: value,
        }));

        // 수식이 포함된 경우 실시간 계산 시도
        if (value.match(/[+\-*/]/)) {
            try {
                const result = evaluateExpression(value);
                if (!isNaN(result)) {
                    setValues(prev => ({
                        ...prev,
                        [name]: result,
                    }));
                }
            } catch (error) {
                // 계산 실패 시 무시
            }
        } else {
            // 숫자만 있는 경우 콤마 처리
            const numericValue = value.replace(/,/g, '');
            if (!isNaN(numericValue) && numericValue !== '') {
                setValues(prev => ({
                    ...prev,
                    [name]: Number(numericValue),
                }));
            }
        }
    };

    // 키 입력 처리
    const handleKeyDown = (e, name) => {
        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            const result = evaluateExpression(e.target.value);
            if (!isNaN(result)) {
                const newValue = Math.round(result);
                setValues(prev => ({
                    ...prev,
                    [name]: newValue,
                }));
                setDisplayValues(prev => ({
                    ...prev,
                    [name]: formatNumber(newValue),
                }));
                // 모바일에서 키보드 닫기
                e.target.blur();
            }
        }
    };

    // 결과 계산
    useEffect(() => {
        const numValues = {
            currentProperty: Number(String(values.currentProperty).toString().replace(/,/g, '')),
            bankLoan: Number(String(values.bankLoan).toString().replace(/,/g, '')),
            savings: Number(String(values.savings).toString().replace(/,/g, '')),
            newProperty: Number(String(values.newProperty).toString().replace(/,/g, '')),
        };

        const currentAssets = numValues.currentProperty - numValues.bankLoan;
        const requiredDownPayment = numValues.newProperty * ((100 - values.ltvRatio) / 100);
        const totalRequired = requiredDownPayment - currentAssets;
        const finalRequired = totalRequired - numValues.savings;

        setResults({
            currentAssets,
            requiredDownPayment,
            totalRequired,
            finalRequired,
        });
    }, [values]);

    // 데이터 저장
    const saveData = () => {
        localStorage.setItem('realEstateCalcValues', JSON.stringify(values));
        // 저장 알림 표시
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.remove('hidden');
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 2000);
        }
    };

    // 데이터 초기화
    const resetData = () => {
        const initialValues = {
            currentProperty: '',
            bankLoan: '',
            savings: '',
            newProperty: '',
            ltvRatio: 80,
        };
        setValues(initialValues);
        setDisplayValues({
            currentProperty: '',
            bankLoan: '',
            savings: '',
            newProperty: '',
        });
        localStorage.removeItem('realEstateCalcValues');
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col max-h-screen">
            {/* 알림 메시지 */}
            <div
                id="notification"
                className="hidden fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            >
                저장되었습니다!
            </div>

            {/* 고정 영역 (헤더 + 결과) */}
            <div className="flex-none">
                {/* 헤더 */}
                <div className="bg-white shadow-md">
                    <div className="max-w-md mx-auto px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Calculator className="w-6 h-6 mr-2 text-blue-600" />
                                <h1 className="text-xl font-bold">부동산 자금 계산기</h1>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsResultVisible(!isResultVisible)}
                                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    {isResultVisible ? '결과 접기' : '결과 보기'}
                                </button>
                                <button
                                    onClick={saveData}
                                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    <Save className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={resetData}
                                    className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 결과 표시 영역 */}
                <div
                    className={`max-w-md mx-auto bg-white border-t transform transition-all duration-300 ease-in-out ${isResultVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 h-0 overflow-hidden'
                        }`}
                >
                    <div className="px-4 py-2">
                        {/* 자산 현황 그룹 */}
                        <div className="mb-3">
                            <h3 className="text-sm font-medium text-gray-500 mb-1">자산 현황</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 p-2 rounded-lg">
                                    <span className="text-sm text-gray-600">현재 부동산</span>
                                    <div className="text-lg font-bold text-blue-600">
                                        {formatNumber(Number(values.currentProperty))}만원
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-lg">
                                    <span className="text-sm text-gray-600">보유 예금</span>
                                    <div className="text-lg font-bold text-blue-600">
                                        {formatNumber(Number(values.savings))}만원
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 필요 자금 그룹 */}
                        <div className="mb-3">
                            <h3 className="text-sm font-medium text-gray-500 mb-1">필요 자금</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 p-2 rounded-lg">
                                    <span className="text-sm text-gray-600">
                                        필요 계약금 ({100 - values.ltvRatio}%)
                                    </span>
                                    <div className="text-lg font-bold text-blue-600">
                                        {formatNumber(results.requiredDownPayment)}만원
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-lg">
                                    <span className="text-sm text-gray-600">총 필요자금</span>
                                    <div className="text-lg font-bold text-blue-600">
                                        {formatNumber(results.totalRequired)}만원
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 추가 비용 그룹 */}
                        <div className="mb-3">
                            <h3 className="text-sm font-medium text-gray-500 mb-1">추가 비용</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 p-2 rounded-lg">
                                    <span className="text-sm text-gray-600">중개수수료</span>
                                    <div className="text-xs text-gray-500">
                                        적용요율: {(calculateBrokerageRate(values.newProperty, transactionType) * 100).toFixed(1)}%
                                    </div>
                                    <div className="text-lg font-bold text-red-600">
                                        {formatNumber(Math.round(calculateBrokerageFee(values.newProperty, transactionType) / 10000))}만원
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-lg">
                                    <span className="text-sm text-gray-600">취득세</span>
                                    <div className="text-xs text-gray-500">
                                        {getTaxFormula(values.newProperty, isFirstTime, region, transactionType)}
                                    </div>
                                    <div className="text-lg font-bold text-red-600">
                                        {formatNumber(Math.round(calculateAcquisitionTax(values.newProperty, isFirstTime, region, transactionType) / 10000))}만원
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 최종 필요자금 */}
                        <div className="space-y-2">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm text-gray-600">필요자금부족분 (추가비용 제외)</span>
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatNumber(results.finalRequired)}만원
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm text-gray-600">최종 필요자금 (추가비용 포함)</span>
                                <div className="text-3xl font-bold text-red-600">
                                    {formatNumber(Math.round(
                                        results.finalRequired +
                                        calculateBrokerageFee(values.newProperty, transactionType) / 10000 +
                                        calculateAcquisitionTax(values.newProperty, isFirstTime, region, transactionType) / 10000
                                    ))}만원
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 스크롤 가능한 입력 영역 */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-md mx-auto p-4">
                    <div className="space-y-4">
                        {/* 기본 입력 필드들 */}
                        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    현재 부동산 금액 <span className="text-gray-500">(단위: 만원)</span>
                                </label>
                                <input
                                    type="text"
                                    inputMode="text"
                                    value={displayValues.currentProperty}
                                    onChange={(e) => handleInputChange('currentProperty', e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'currentProperty')}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                                    placeholder="금액 입력 (사칙연산 가능)"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    현재 은행 대출금 <span className="text-gray-500">(단위: 만원)</span>
                                </label>
                                <input
                                    type="text"
                                    inputMode="text"
                                    value={displayValues.bankLoan}
                                    onChange={(e) => handleInputChange('bankLoan', e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'bankLoan')}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                                    placeholder="금액 입력 (사칙연산 가능)"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    보유 예금자산 <span className="text-gray-500">(단위: 만원)</span>
                                </label>
                                <input
                                    type="text"
                                    inputMode="text"
                                    value={displayValues.savings}
                                    onChange={(e) => handleInputChange('savings', e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'savings')}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                                    placeholder="금액 입력 (사칙연산 가능)"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    이사갈 부동산 금액 <span className="text-gray-500">(단위: 만원)</span>
                                </label>
                                <input
                                    type="text"
                                    inputMode="text"
                                    value={displayValues.newProperty}
                                    onChange={(e) => handleInputChange('newProperty', e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'newProperty')}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                                    placeholder="금액 입력 (사칙연산 가능)"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    LTV 비율 (%)
                                </label>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    value={values.ltvRatio}
                                    onChange={(e) => setValues(prev => ({
                                        ...prev,
                                        ltvRatio: Number(e.target.value)
                                    }))}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                                    placeholder="LTV 비율 입력"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>

                        {/* 추가 비용 계산 섹션 */}
                        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                            <h2 className="text-lg font-bold">추가 비용 설정</h2>

                            {/* 거래 유형 선택 */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    거래 유형
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="sale"
                                            checked={transactionType === 'sale'}
                                            onChange={(e) => setTransactionType(e.target.value)}
                                            className="mr-2"
                                        />
                                        매매
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="rent"
                                            checked={transactionType === 'rent'}
                                            onChange={(e) => setTransactionType(e.target.value)}
                                            className="mr-2"
                                        />
                                        전세
                                    </label>
                                </div>
                            </div>

                            {/* 지역 구분 */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    지역 구분
                                </label>
                                <select
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="normal">일반지역</option>
                                    <option value="speculative">투기과열지구</option>
                                </select>
                            </div>

                            {/* 생애최초 구입 여부 */}
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isFirstTime}
                                        onChange={(e) => setIsFirstTime(e.target.checked)}
                                        className="mr-2"
                                    />
                                    생애최초 구입
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedRealEstateCalculator;