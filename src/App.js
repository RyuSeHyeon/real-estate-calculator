import { useState, useEffect } from 'react';
import { Calculator, Save, RotateCcw } from 'lucide-react';

const EnhancedRealEstateCalculator = () => {
    // 숫자 포맷팅 함수를 먼저 정의
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

    // 문자열 수식 계산
    const evaluateExpression = (expr) => {
        try {
            const cleanExpr = expr.replace(/,/g, '').replace(/\s/g, '');
            if (!/^[0-9+\-*/().]+$/.test(cleanExpr)) {
                return NaN;
            }
            const result = new Function(`return ${cleanExpr}`)();
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
        <div className="min-h-screen bg-gray-50">
            {/* 알림 메시지 */}
            <div
                id="notification"
                className="hidden fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            >
                저장되었습니다!
            </div>

            {/* 헤더 */}
            <div className="sticky top-0 bg-white shadow-md z-10">
                <div className="max-w-md mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Calculator className="w-6 h-6 mr-2 text-blue-600" />
                            <h1 className="text-xl font-bold">부동산 자금 계산기</h1>
                        </div>
                        <div className="flex gap-2">
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

            {/* 메인 컨텐츠 */}
            <div className="max-w-md mx-auto p-4">
                <div className="space-y-4">
                    {/* 입력 필드들 */}
                    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                현재 부동산 금액
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
                                현재 은행 대출금
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
                                보유 예금자산
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
                                이사갈 부동산 금액
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

                    {/* 결과 표시 */}
                    <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                        <div className="flex justify-between">
                            <span className="font-medium">보유 자산:</span>
                            <span className="text-blue-600 text-lg">
                                {formatNumber(results.currentAssets)}원
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="font-medium">
                                필요한 계약금 ({100 - values.ltvRatio}%):
                            </span>
                            <span className="text-blue-600 text-lg">
                                {formatNumber(results.requiredDownPayment)}원
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="font-medium">총 필요 자금:</span>
                            <span className="text-blue-600 text-lg">
                                {formatNumber(results.totalRequired)}원
                            </span>
                        </div>

                        <div className="flex justify-between border-t pt-3">
                            <span className="font-bold">현재 필요자금:</span>
                            <span className="font-bold text-red-600 text-xl">
                                {formatNumber(results.finalRequired)}원
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedRealEstateCalculator;