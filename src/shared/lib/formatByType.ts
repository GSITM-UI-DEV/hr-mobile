export const formatByType = (type: 'date' | 'time' | 'number', input: string | number): string => {
  const strInput = typeof input === 'number' ? input.toString() : input.replace(/[^0-9]/g, ""); // 숫자를 문자열로 변환 및 숫자 이외 제거

  switch (type) {
    case 'date': {
      // YYYY-MM-DD 형식
      return strInput.length >= 4
        ? `${strInput.slice(0, 4)}-${strInput.slice(4, 6)}${strInput.length > 6 ? `-${strInput.slice(6, 8)}` : ""}`
        : input.toString();
    }

    case 'time': {
      // HH:MM 형식
      return strInput.length >= 2
        ? `${strInput.slice(0, 2)}${strInput.length > 2 ? `:${strInput.slice(2, 4)}` : ""}`
        : input.toString();
    }

    case 'number': {
      // 3자리마다 콤마 추가
      return strInput.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    default:
      return input.toString(); // 처리할 수 없는 타입은 원본 반환
  }
}