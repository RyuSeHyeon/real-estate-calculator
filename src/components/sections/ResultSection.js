import React from 'react';
import { formatNumber } from '../../utils/formatters';

const ResultSection = ({
    values,
    results,
    transactionType,
    setShowBrokerageTable,
    calculateBrokerageFee,
    calculateBrokerageRate,
}) => {
    // 중개수수료 계산
    const brokerageFee = calculateBrokerageFee(values.newProperty, transactionType);

    // 최종 필요자금 계산 (추가비용 제외/포함)
    const finalRequiredWithoutExtra = results.finalRequired;
    const finalRequiredWithExtra = results.finalRequired + (brokerageFee / 10000);

    return (
        <div className="max-w-md mx-auto px-4 py-2 bg-white">
            <div className="space-y-4">
                {/* 자산 현황 그룹 */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">자산 현황</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-600">현재 부동산</span>
                            <div className="text-lg font-bold text-blue-600">
                                {formatNumber(Number(values.currentProperty))}만원
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-600">보유 예금</span>
                            <div className="text-lg font-bold text-blue-600">
                                {formatNumber(Number(values.savings))}만원
                            </div>
                        </div>
                    </div>
                </div>

                {/* 필요 자금 그룹 */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">필요 자금</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-600">필요 계약금 ({100 - values.ltvRatio}%)</span>
                            <div className="text-lg font-bold text-blue-600">
                                {formatNumber(results.requiredDownPayment)}만원
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-600">총 필요자금</span>
                            <div className="text-lg font-bold text-blue-600">
                                {formatNumber(results.totalRequired)}만원
                            </div>
                        </div>
                    </div>
                </div>

                {/* 추가 비용 그룹 */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">추가 비용</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 p-2 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">중개수수료</span>
                                <button
                                    onClick={() => setShowBrokerageTable(true)}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                >
                                    중개수수료 요율표
                                </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                적용요율: {(calculateBrokerageRate(values.newProperty, transactionType) * 100).toFixed(1)}%
                            </div>
                            <div className="text-base font-bold text-red-600 mt-1">
                                {formatNumber(Math.round(brokerageFee / 10000))}만원
                            </div>
                        </div>

                        {/* 취득세계산기 링크 */}
                        <div className="bg-gray-50 p-2 rounded-lg flex flex-col justify-center items-center">
                            <span className="text-xs text-gray-600 mb-1">취득세 계산이 필요하신가요?</span>
                            <a
                                href="https://xn--989a00af8jnslv3dba.com/%EC%B7%A8%EB%93%9D%EC%84%B8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                취득세계산기 바로가기
                            </a>
                        </div>
                    </div>
                </div>

                {/* 최종 필요자금 */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">최종 결과</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="text-base text-gray-600">필요자금부족분</span>
                            <div className="text-2xl font-bold text-blue-600">
                                {formatNumber(Math.round(finalRequiredWithoutExtra))}만원
                            </div>
                            <span className="text-sm text-gray-500">(추가비용 제외)</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="text-base text-gray-600">최종 필요자금</span>
                            <div className="text-2xl font-bold text-red-600">
                                {formatNumber(Math.round(finalRequiredWithExtra))}만원
                            </div>
                            <span className="text-sm text-gray-500">(추가비용 포함)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultSection;