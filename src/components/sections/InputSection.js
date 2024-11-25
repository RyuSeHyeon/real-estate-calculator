import React from 'react';

const InputSection = ({
    displayValues,
    values,
    transactionType,
    handleInputChange,
    handleKeyDown,
    setValues,
    setTransactionType
}) => (
    <div className="max-w-md mx-auto p-4">
        <div className="space-y-4">
            {/* 기본 입력 필드 */}
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

            {/* 추가 비용 설정 섹션 */}
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
            </div>
        </div>
    </div>
);

export default InputSection;