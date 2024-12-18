// 부재시간 관리
export interface Absence {
	realOtEndTime: "",
	holidayNameHan: "",
	sStartDate: "20241101",
	otEndTime: "",
	realSuppleWorkHour: "",
	planWorkHour: 8,
	emplNo: "00000252",
	nwkDayHour: "0108",
	emplNameHan: "하주찬",
	realOtWorkHour: 0,
	realSuppleEndTime: "",
	sWorkHour: 8.05,
	subholiCancelDate: "",
	otStartTime: "",
	workCode: "",
	sStartTime: "0735",
	day: "금",
	otEndDate: "",
	subholiLveHour: "",
	otRealWorkHour: "-",
	realWorkHour: "0800",
	wrkWorkHour: "",
	planStartTime: "0830",
	suppleFromTo: "-",
	workName: "통상근무",
	suppleEndTime: "",
	suppleRealWorkHour: "",
	sRealEndTime: "1638",
	otStartDate: "",
	otNextDayInd: "",
	sEndDate: "20241101",
	otPlanHour: "-",
	workStartTime: "0000",
	suppleWorkHour: "",
	suppleStartTime: "",
	orgNameHan: "인사팀",
	planNextDayInd: "N",
	realOtStartTime: "",
	sRealStartTime: "0830",
	sEndTime: "1638",
	subholiDate: "",
	workDate: "20241101",
	supplePlanHour: "",
	coCode: "1000",
	otWorkHour: 0,
	holidayCode: " ",
	sNextDayInd: "N",
	planEndDate: "20241101",
	workEndTime: "",
	workStatus: " ",
	planFromTo: "08:30 ~ 17:30",
	otFromTo: "-",
	realSuppleStartTime: "",
	workCodeName: "",
	planHour: "0800",
	workTypeCode: "A",
	planEndTime: "1730",
	planStartDate: "20241101",
	workDivision: " ",
	sRealWorkHour: 8
}


// 부재시간 관리
export interface AbsenceDetail {
    admitHour: "0000",
    closeInd: "N",
    chgAbsStartTime: "",
    nwkOtHour: "0000",
    emplNo: "00000252",
    nwkDayHour: "0108",
    wkEndTime: "",
    absEndTime: "1046",
    chngRsn: "",
    wkStartTime: "",
    workDate: "20241101",
    coCode: "1000",
    absHour: "0108",
    startTime: "07:35",
    absRsn: "B1",
    endTime: "16:38",
    absStartTime: "0938",
    chgAbsEndTime: "",
    seq: 1
}

// 근태종류
export interface AttendanceKind {
  fullDayInd: string,
  maxHour: string,
  workCodeKind: string,
  workCode: string,
  atchInd: string,
  docMsg: string,
  codeNameHan: string,
  timeInd: boolean,
  fixHour: string,
  holIncYn: string
}
// 근태종류
export interface AttendanceEvent {
  cncCodeNameHan: string,
  cncCode: string,
}
export interface AttendancePeriod {
	baseCode: string,
	codeNameHan: string,
}
export interface AttendanceMaternity {
	baseCode: string,
	codeNameHan: string,
}
// 휴/복직 구분
export interface AttendanceSwitch {
  codeNameEng: string,
  rsnInd: string,
  workCodeKind: string,
  coCode: string,
  workCode: string,
  atchInd: string,
  effDateTo: string,
  displayOrder: number,
  codeNameHan: string,
  effDateFrom: string,
  payCode: string
}
// 
export interface AttendanceRemain {
  lmUseDays: number,
  rmnLve: number,
  lmLveDays: number,
  lyLveDays: number,
  lyUseDays: number,
  rmnLveMnth: number
}


























// export interface WorkReq {
// 	coCode: string,
// 	baseMonth: string,
// 	emplNo: string,
// }
// export interface WorkChartRes {
// 	workHour: string,
// 	workRealHour: string,
// 	otDayHour: string,
// 	otDayRealHour: string,
// 	otTotHour: string,
// 	otTotRealHour: string
// }
// export interface WorkRecordRes {
// 	workDate: string,
// 	startTime: string,
// 	endTime: string,
// 	workDayHour: string,
// 	workOtHour: string
// }
// export interface WorkScheduleRequest {
// 	coCode: string,
// 	baseMonth: string,
// 	emplNo: string,
// }
// export interface WorkScheduleResponse {
// 	workDate: string,
// 	workPt: string,
// 	workTimeFrom: string,
// 	workTimeTo: string,
// 	workCodeKind: string
// }
// export interface AbsencePeriodRequest {
// 	coCode: string,
// 	fromDate: string,
// 	toDate: string,
// 	emplNo: string
// }
// export interface AbsenceDateRequest {
// 	coCode: string,
// 	baseDate: string,
// 	emplNo: string
// }
// export interface AbsencePeriodResponse {
// 	workDate: string,
// 	absHour: string,
// 	admitHour: string,
// 	nwkDayHour: string,
// 	nwkOtHour: string
// }
// export interface AbsenceDateResponse {
// 	wrkGubun: string,
// 	absStartTime: string,
// 	absEndTime: string,
// 	absHour: string,
// 	admitHour: string,
// 	absRsn: string,	
// }
// export interface AbsenceDateResponse {
// 	absStartTime: string,
// 	absEndTime: string,
// 	wkStartTime: string,
// 	wrkEndTime: string,
// 	chngRsn: string
// }
// export interface MemberScheduleRequest {
// 	coCode: string,
// 	baseDate: string,
// 	orgCode: string
// }
// export interface MemberScheduleRespose {
// 	emplNameHan: string,
// 	workPt: string,
// 	workTimeFrom: string,
// 	workTimeTo: string,
// 	workCodeKind: string
// }




export interface AttendanceHour {
	realOtEndTime: "",
	holidayNameHan: "",
	sStartDate: "20241101",
	otEndTime: "",
	realSuppleWorkHour: "",
	planWorkHour: 8,
	emplNo: "00000252",
	nwkDayHour: "0108",
	emplNameHan: "하주찬",
	realOtWorkHour: 0,
	realSuppleEndTime: "",
	sWorkHour: 8.05,
	subholiCancelDate: "",
	otStartTime: "",
	workCode: "",
	sStartTime: "-",
	day: "금",
	otEndDate: "",
	subholiLveHour: "",
	otRealWorkHour: "-",
	realWorkHour: "0800",
	wrkWorkHour: "",
	planStartTime: "0830",
	suppleFromTo: "-",
	workName: "통상근무",
	suppleEndTime: "",
	suppleRealWorkHour: "",
	sRealEndTime: "",
	otStartDate: "",
	otNextDayInd: "",
	sEndDate: "20241101",
	otPlanHour: "-",
	workStartTime: "0000",
	suppleWorkHour: "",
	suppleStartTime: "",
	orgNameHan: "인사팀",
	planNextDayInd: "N",
	realOtStartTime: "",
	sRealStartTime: "0830",
	sEndTime: "1638",
	subholiDate: "",
	workDate: "20241101",
	supplePlanHour: "",
	coCode: "1000",
	otWorkHour: 0,
	holidayCode: " ",
	sNextDayInd: "N",
	planEndDate: "20241101",
	workEndTime: "",
	workStatus: " ",
	planFromTo: "08:30 ~ 17:30",
	otFromTo: "-",
	realSuppleStartTime: "",
	workCodeName: "",
	planHour: "0800",
	workTypeCode: "A",
	planEndTime: "1730",
	planStartDate: "20241101",
	workDivision: " ",
	sRealWorkHour: 8
}
export interface AttendanceHourDetail {
	admitHour: "0000",
	closeInd: "N",
	chgAbsStartTime: "",
	nwkOtHour: "0000",
	emplNo: "00000252",
	nwkDayHour: "0108",
	wkEndTime: "",
	absEndTime: "1046",
	chngRsn: "",
	wkStartTime: "",
	workDate: "20241101",
	coCode: "1000",
	absHour: "0108",
	startTime: "07:35",
	absRsn: "B1",
	endTime: "16:38",
	absStartTime: "0938",
	chgAbsEndTime: "",
	seq: 1
}
export interface AttendanceSchedule {
	workTypeCode: string,
	planEndTime: string,
	planStartDate: string,
	workDivision: string,
	sRealWorkHour: number,
	startTime: string,
}
export interface AttendanceScheduleMember {
	workCodeKind: "LY",
	attendees: "방기환",
	halfday: "전일",
	startTime: "2016-07-29 08:30:00",
	endTime: "2016-07-29 17:30:00",
	title: "연차",
	category: "time",
	colorCd: "#0040ff"
}
export interface AttendanceShift {
  shftTypeCode: string;
	workPt: string;
}
export interface AttendanceShiftType {
  workType: string
}




interface WorkInfo {
  workDays: number;
  workHour: number;
}

interface CalItem {
  workCode: string;
  attendees: string;
  startTime: string; // ISO format date-time string
  endTime: string;   // ISO format date-time string
  title: string;
  category: string;
  colorCd: string;
}

export interface AttendanceChoosePlan {
  workInfo: WorkInfo[];
  calList: CalItem[];
}

// export interface AttendanceChoosePlan {
// 	calList: Array<{
// 		workCode: string,
// 		attendees: string,
// 		startTime: string,
// 		endTime: string,
// 		title: string,
// 		category: string,
// 		colorCd: string,
// 	}>;
// 	workInfo: Array<{
// 		workDays: number;
// 		workHour: number;
// 	}>;
// }

export interface AttendanceOverTime {
  nextDayInd: string,
  shftPt: string,
  jobGroupCode: string,
  coCode: string,
  workCode: string,
  endDate: string,
  workPt: string,
  startTime: string,
  emplNo: string,
  workTime: number,
  realWorkPt: string,
  wcDate:string
}

export interface AttendanceOverTimeCancel {
  reqEmplNo: string,
  hours: number,
  endDate: string,
  emplNo: string,
  startEndDate: string,
  workCodeKind: string,
  coCode: string,
  days: number,
  wrkGubun: string,
  startTime: string,
  endTime: string,
  startDate: string,
  befDocNo: string
}


export interface AttendanceHistory {
  workDate: string,
  startTime: string,
  endTime: string,
  workHour: number,
  day: number,
  chngInd: string
}


export interface AttendanceList {
	formId: string,
	reqEmplNo: string,
	orgNameHan: string,
	positionCode: string,
	pgmId: string,
	positionNameHan: string,
	docNo: string,
	gwDocNo: string,
	titleCode: string,
	pgmUrlAd: string,
	orgCode: string,
	titleNameHan: string,
	formName: string,
	statusName: string,
	reqEmplName: string,
	reqstDate: string,
	docTitlNm: string,
	statusCode: string,
	createDate: string
}


export interface AttendanceForm {
  formId: string,
  aprvDepth: number,
  classCode: string,
  formFileName: string,
  coCode: string,
  effDateTo: string,
  formName: string,
  pgmId: string,
  effDateFrom: string,
  mblPgmId: string
}