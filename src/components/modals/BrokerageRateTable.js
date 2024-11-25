import React from 'react';

const BrokerageRateTable = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">중개수수료 요율표</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    ✕
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border p-2">거래내용</th>
                            <th className="border p-2">거래금액</th>
                            <th className="border p-2">상한요율</th>
                            <th className="border p-2">한도액</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowSpan="6" className="border p-2">매매·교환</td>
                            <td className="border p-2">5천만원 미만</td>
                            <td className="border p-2">0.6%</td>
                            <td className="border p-2">25만원</td>
                        </tr>
                        <tr>
                            <td className="border p-2">5천만원 이상 ~ 2억원 미만</td>
                            <td className="border p-2">0.5%</td>
                            <td className="border p-2">80만원</td>
                        </tr>
                        <tr>
                            <td className="border p-2">2억원 이상 ~ 9억원 미만</td>
                            <td className="border p-2">0.4%</td>
                            <td className="border p-2">-</td>
                        </tr>
                        <tr>
                            <td className="border p-2">9억원 이상 ~ 12억원 미만</td>
                            <td className="border p-2">0.5%</td>
                            <td className="border p-2">-</td>
                        </tr>
                        <tr>
                            <td className="border p-2">12억원 이상 ~ 15억원 미만</td>
                            <td className="border p-2">0.6%</td>
                            <td className="border p-2">-</td>
                        </tr>
                        <tr>
                            <td className="border p-2">15억원 이상</td>
                            <td className="border p-2">0.7%</td>
                            <td className="border p-2">-</td>
                        </tr>
                        <tr>
                            <td rowSpan="6" className="border p-2">임대차 등</td>
                            <td className="border p-2">5천만원 미만</td>
                            <td className="border p-2">0.4%</td>
                            <td className="border p-2">20만원</td>
                        </tr>
                        <tr>
                            <td className="border p-2">5천만원 이상 ~ 1억원 미만</td>
                            <td className="border p-2">0.4%</td>
                            <td className="border p-2">30만원</td>
                        </tr>
                        <tr>
                            <td className="border p-2">1억원 이상 ~ 6억원 미만</td>
                            <td className="border p-2">0.3%</td>
                            <td className="border p-2">-</td>
                        </tr>
                        <tr>
                            <td className="border p-2">6억원 이상 ~ 12억원 미만</td>
                            <td className="border p-2">0.4%</td>
                            <td className="border p-2">-</td>
                        </tr>
                        <tr>
                            <td className="border p-2">12억원 이상 ~ 15억원 미만</td>
                            <td className="border p-2">0.5%</td>
                            <td className="border p-2">-</td>
                        </tr>
                        <tr>
                            <td className="border p-2">15억원 이상</td>
                            <td className="border p-2">0.6%</td>
                            <td className="border p-2">-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default BrokerageRateTable;