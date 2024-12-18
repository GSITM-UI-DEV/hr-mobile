export type validate = {
  remainingLeaveDays: number,
  holidays: string,
  startDate: string,
  endDate: string,
  leaveDays: string,
  workingDays: string,
}



export const validateLeaveApplication = (params: validate) => {
  // 날짜 유효성 검사
  if (!params.startDate || !params.endDate || params.startDate > params.endDate) {
    return { valid: false, message: "시작일과 종료일이 유효하지 않습니다." };
  }

  // 날짜 배열 생성
  const dateRange = getDateRange(params.startDate, params.endDate);

  // 공휴일 및 휴가일 필터링
  const validLeaveDays = dateRange.filter(
    (date) => !params.holidays.includes(date) && params.workingDays.includes(date)
  );

  // 휴가 사용 가능 여부 확인
  if (validLeaveDays.length > params.remainingLeaveDays) {
    return {
      valid: false,
      message: `잔여 휴가일(${params.remainingLeaveDays})보다 많은 일수를 사용하려고 합니다.`,
    };
  }

  // 기존 휴가일과의 중복 확인
  const overlappingDays = validLeaveDays.filter((date) => params.leaveDays.includes(date));
  if (overlappingDays.length > 0) {
    return {
      valid: false,
      message: `이미 휴가로 사용된 날짜가 포함되어 있습니다: ${overlappingDays.join(", ")}`,
    };
  }

  return {
    valid: true,
    message: "휴가 신청이 유효합니다.",
  };
}

// Helper 함수: 시작일과 종료일 사이의 날짜 배열 생성
export const getDateRange = (start: string, end: string) => {
  const dateArray = [];
  let currentDate = new Date(start);

  while (currentDate <= new Date(end)) {
    dateArray.push(currentDate.toISOString().split("T")[0]); // YYYY-MM-DD 형식
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}