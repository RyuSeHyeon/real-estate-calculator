import React, { useState, useEffect } from 'react';
import { Calculator, Save, RotateCcw } from 'lucide-react';
import BrokerageRateTable from './components/modals/BrokerageRateTable';
import ResultSection from './components/sections/ResultSection';
import InputSection from './components/sections/InputSection';
import { formatNumber, evaluateExpression } from './utils/formatters';
import { calculateBrokerageRate, calculateBrokerageFee } from './utils/calculations';

const App = () => {
    // 결과 표시 여부 상태
    const [isResultVisible, setIsResultVisible] = useState(true);
    const [showBrokerageTable, setShowBrokerageTable] = useState(false);

    // 기본 값들 상태
    const [values, setValues] = useState(() => {
        try {
            const savedValues = localStorage.getItem('realEstateCalcValues');
            return savedValues ? JSON.parse(savedValues) : {
                currentProperty: '',
                bankLoan: '',
                savings: '',
                newProperty: '',
                ltvRatio: 80,
                transactionType: 'sale'
            };
        } catch (error) {
            return {
                currentProperty: '',
                bankLoan: '',
                savings: '',
                newProperty: '',
                ltvRatio: 80,
                transactionType: 'sale'
            };
        }
    });

    // 화면 표시 값 상태
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

    // 계산 결과 상태
    const [results, setResults] = useState({
        currentAssets: 0,
        requiredDownPayment: 0,
        totalRequired: 0,
        finalRequired: 0,
    });

    // 설정 값들 상태
    const [transactionType, setTransactionType] = useState(values.transactionType);

    // 입력값 처리
    const handleInputChange = (name, value) => {
        setDisplayValues(prev => ({
            ...prev,
            [name]: value,
        }));

        if (value.match(/[+\-*/]/)) {
            return;
        }

        const numericValue = value.replace(/,/g, '');
        if (!isNaN(numericValue) && numericValue !== '') {
            setValues(prev => ({
                ...prev,
                [name]: Number(numericValue),
            }));
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
                e.target.blur();
            }
        }
    };

    // 데이터 저장
    const saveData = () => {
        const dataToSave = {
            ...values,
            transactionType
        };
        localStorage.setItem('realEstateCalcValues', JSON.stringify(dataToSave));
        
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
            transactionType: 'sale'
        };
        setValues(initialValues);
        setDisplayValues({
            currentProperty: '',
            bankLoan: '',
            savings: '',
            newProperty: '',
        });
        setTransactionType(initialValues.transactionType);
        
        localStorage.removeItem('realEstateCalcValues');
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

    return (
        <div className="h-screen flex flex-col">
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
                <div className={`max-w-md mx-auto bg-white border-t ${
                    isResultVisible ? 'block' : 'hidden'
                }`}>
                    <ResultSection
                        values={values}
                        results={results}
                        transactionType={transactionType}
                        setShowBrokerageTable={setShowBrokerageTable}
                        calculateBrokerageFee={calculateBrokerageFee}
                        calculateBrokerageRate={calculateBrokerageRate}
                    />
                </div>
            </div>

            {/* 스크롤 가능한 입력 영역 */}
            <div className="flex-1 overflow-auto bg-gray-50">
                <InputSection
                    displayValues={displayValues}
                    values={values}
                    transactionType={transactionType}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                    setValues={setValues}
                    setTransactionType={setTransactionType}
                />
            </div>

            {/* 모달 */}
            {showBrokerageTable && <BrokerageRateTable onClose={() => setShowBrokerageTable(false)} />}
        </div>
    );
};

export default App;
