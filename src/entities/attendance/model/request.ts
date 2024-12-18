export interface Attendance {
	coCode: string,
	docNo: string,
	reqEmplNo: string,
	emplNo: string,
	workCodeKind: string,
	startDate: string,
	endDate: string,
	wrkGubun: string,
	startTime: string,
	endTime: string,
	reqRsn: string,
	cncCode: string,
	relCode: string,
	atchFileId: string;
	sStartTime: string;
	sEndTime: string;
}

export interface AttendanceCancel {
	coCode: string,
	docNo: string,
	reqEmplNo: string,
	emplNo: string,
	workCodeKind: string,
	startDate: string,
	endDate: string,
	wrkGubun: string,
	startTime: string,
	endTime: string,
	cnclRsn: string
}

export interface LeaveReinstate {
	coCode: string,
	docNo: string,
	reqEmplNo: string,
	emplNo: string,
	stopCode: string,
	stopDateFrom: string,
	stopDateTo: string,
	stopRsn: string,
	atchFileId: string
}


export interface WorkMonthPlan {
	coCode: string,
	docNo: string,
	workYyMm: string,
	reqEmplNo: string,
	emplNo: string,
	workDays: string,
	workHour: string,
	planDays: string,
	planHour: string
}
export interface WorkDayPlan {
	docNo: string,
	workDate: string,
	startTime: string,
	endTime: string,
	workHour: string
}


export interface CommuteRecord {
	coCode: string,
	docNo: string,
	seqNo: string,
	reqEmplNo: string,
	emplNo: string,
	workDate: string,
	startTime: string,
	endTime: string,
	chngRsn: string
}


export interface OverWork {
	coCode: string,
	docNo: string,
	seqNo: string,
	reqEmplNo: string,
	emplNo: string,
	otCode: string,
	workDate: string,
	endDate: string,
	otTime: string,
	reqRsnCode: string,
	otRsn: string,
	atchFileId: string
}
export interface OverWorkCancel {
	coCode: string,
	emplNo: string,
	docNo: string,
	seqNo: string,
	workDate: string,
	endDate: string,
	otCode: string,
	startTime: string,
	endTime: string,
	otRsn: string
}


export interface ShortWork {
	coCode: string,
	emplNo: string,
	docNo: string,
	shrtCode: string,
	shrtHour: string,
	shrtDateFrom: string,
	shrtDateTo: string,
	shrtRsn: string,
	atchFileId: string
}


export type Adt = {
	sStartTime: string;
	sEndTime: string;
}


export type AdtCancel = {
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




// entities/models.ts
export interface WcwrkreqCnclDto {
  reqEmplNo: string;
  reqEmplName: string;
  docNo: string;
  befDocNo: string;
  statusCode: string;
  emplNo: string;
  days: number;
  startDate: string;
  startEndDate: string;
  workCodeKind: string;
  wrkGubun: string;
  rowKey: string;
  rowStatus: string;
}

export interface AprvdetailDto {
  docNo: string;
	aprvSeqNo: string;
	aprvType: string;
	aprvEmplNo: string;
	transInd: string;
	tarnsEmplNo: string;
	statusCode: string;
}

// Request payload 타입
export interface RequestPayload {
  wcwrkreqCnclDtoList: WcwrkreqCnclDto[];
  aprvdetailDtoList: AprvdetailDto[];
}