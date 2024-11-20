import { useState, useEffect } from 'react';
import { Calculator, Save, RotateCcw } from 'lucide-react';

const EnhancedRealEstateCalculator = () => {
  const [values, setValues] = useState(() => {
    const savedValues = localStorage.getItem('realEstateCalcValues');
    return savedValues ? JSON.parse(savedValues) : {
      currentProperty: '',
      bankLoan: '',
      savings: '',
      newProperty: '',
      ltvRatio: 80,
    };
  });

  const [results, setResults] = useState({
    currentAssets: 0,
    requiredDownPayment: 0,
    totalRequired: 0,
    finalRequired: 0,
  });

  const [displayValues, setDisplayValues] = useState({
    currentProperty: '',
    bankLoan: '',
    savings: '',
    newProperty: '',
  });

  // 숫자 포맷팅 (천 단위 구분)
  const formatNumber = (num) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  // 문자열 수식 계산 함수 개선
  const evaluateExpression = (expr) => {
      try {
          // 콤마 제거 및 공백 제거
          const cleanExpr = expr.replace(/,/g, '').replace(/\s/g, '');
          // 기본적인 유효성 검사
          if (!/^[0-9+\-*/().]+$/.test(cleanExpr)) {
              return NaN;
          }
          // eval 대신 Function 사용하여 보안 강화
          const result = new Function(`return ${cleanExpr}`)();
          return isFinite(result) ? result : NaN;
      } catch (error) {
          return NaN;
      }
  };

  // 입력값 처리 함수 수정
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
                  const formattedResult = formatNumber(result);
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
              setDisplayValues(prev => ({
                  ...prev,
                  [name]: formatNumber(numericValue),
              }));
              setValues(prev => ({
                  ...prev,
                  [name]: Number(numericValue),
              }));
          }
      }
  };

  // 키 입력 처리 함수 수정
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
      currentProperty: Number(String(values.currentProperty).replace(/,/g, '')),
      bankLoan: Number(String(values.bankLoan).replace(/,/g, '')),
      savings: Number(String(values.savings).replace(/,/g, '')),
      newProperty: Number(String(values.newProperty).replace(/,/g, '')),
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
    alert('저장되었습니다!');
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
    setDisplayValues(initialValues);
    localStorage.removeItem('realEstateCalcValues');
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-center mb-6">
        <Calculator className="w-6 h-6 mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold text-center">부동산 자금 계산기</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={saveData}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Save className="w-4 h-4 mr-2" />
          저장
        </button>
        <button
          onClick={resetData}
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          초기화
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            현재 부동산 금액
          </label>
          <input
            type="text"
            inputMode="decimal"
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
            inputMode="decimal"
            value={displayValues.currentProperty}
            onChange={(e) => handleInputChange('currentProperty', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'currentProperty')}
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
            inputMode="decimal"
            value={displayValues.currentProperty}
            onChange={(e) => handleInputChange('currentProperty', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'currentProperty')}
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
            inputMode="decimal"
            value={displayValues.currentProperty}
            onChange={(e) => handleInputChange('currentProperty', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'currentProperty')}
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
            value={values.ltvRatio}
            onChange={(e) => setValues(prev => ({
              ...prev,
              ltvRatio: Number(e.target.value)
            }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="LTV 비율 입력"
            min="0"
            max="100"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">보유 자산:</span>
            <span className="text-blue-600">
              {formatNumber(results.currentAssets)}원
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">
              필요한 계약금 ({100 - values.ltvRatio}%):
            </span>
            <span className="text-blue-600">
              {formatNumber(results.requiredDownPayment)}원
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">총 필요 자금:</span>
            <span className="text-blue-600">
              {formatNumber(results.totalRequired)}원
            </span>
          </div>

          <div className="flex justify-between border-t pt-3">
            <span className="font-bold">현재 필요자금:</span>
            <span className="font-bold text-red-600">
              {formatNumber(results.finalRequired)}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRealEstateCalculator;