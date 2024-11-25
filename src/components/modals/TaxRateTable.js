import React from 'react';

const TaxRateTable = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-5xl max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">취득세율표</h2>
                    <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-500 mb-2">*2024년 정책기준 (2025년까지 연장예정)</span>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>
                </div>
                
                <div className="space-y-6">
                    {/* 생애최초 구입 섹션 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">1. 생애최초 구입</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border p-2">구분</th>
                                        <th className="border p-2">금액 기준</th>
                                        <th className="border p-2">감면 내용</th>
                                        <th className="border p-2">적용 조건</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2" rowSpan="5">소형주택</td>
                                        <td className="border p-2">1.2억원 이하</td>
                                        <td className="border p-2">취득세 면제</td>
                                        <td className="border p-2" rowSpan="5">
                                            - 무주택자<br/>
                                            - 연소득 7천만원 이하<br/>
                                            (맞벌이 8,500만원 이하)<br/>
                                            - 전용 60㎡ 이하<br/>
                                            - 3억원 이하<br/>
                                            (수도권 6억원 이하)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">1.2억원~1.5억원</td>
                                        <td className="border p-2">취득세 50% 감면</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">1.5억원~3억원</td>
                                        <td className="border p-2">취득세 40% 감면</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">3억원~4억원</td>
                                        <td className="border p-2">취득세 20% 감면</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">4억원 초과</td>
                                        <td className="border p-2">감면 혜택 없음</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">일반주택</td>
                                        <td className="border p-2">12억원 이하</td>
                                        <td className="border p-2">취득세 감면한도 200만원</td>
                                        <td className="border p-2">- 연소득 기준 동일</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 일반 구입 섹션 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">2. 일반 구입</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border p-2">주택 수</th>
                                        <th className="border p-2">금액/지역 기준</th>
                                        <th className="border p-2">세율</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2" rowSpan="2">1~2주택</td>
                                        <td className="border p-2">6억원 이하</td>
                                        <td className="border p-2">취득세 1% + 지방교육세 0.1% + 농특세 0.2%</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">6억원 초과</td>
                                        <td className="border p-2">취득세 3% + 지방교육세 0.3% + 농특세 0.2%</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2" rowSpan="2">3주택</td>
                                        <td className="border p-2">조정지역</td>
                                        <td className="border p-2">취득세 6% + 지방교육세 0.4% + 농특세 0.6%</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">비조정지역</td>
                                        <td className="border p-2">취득세 4% + 지방교육세 0.4% + 농특세 0.6%</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">4주택 이상</td>
                                        <td className="border p-2">금액무관</td>
                                        <td className="border p-2">취득세 6% + 지방교육세 0.4% + 농특세 1.0%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxRateTable;
