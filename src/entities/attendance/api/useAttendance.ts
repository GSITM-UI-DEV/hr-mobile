import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Adt, AdtCancel, AttendanceHour, Absence, AbsenceDetail, AttendanceKind, AttendanceEvent, AttendancePeriod, AttendanceSchedule, AttendanceHistory, AttendanceSwitch, AttendanceScheduleMember, AttendanceShift, AttendanceChoosePlan, AttendanceHourDetail, AttendanceOverTime, AttendanceOverTimeCancel, AttendanceRemain, AttendanceList, AttendanceForm, AttendanceShiftType } from "..";

// const fetchAttendance = async (): Promise<Adt[]> => {
// 	const { data } = await axiosInstance.get(`/empmenu/wrkwork/wrkworkplanemp100?baseMonth=2024-11&emplNo=10006254&emplNameHan=%EB%85%B8%ED%83%9C%EA%B7%9C`);
//   // console.log(data);
// 	return data;
// };

// export const useAttendance = () => {
// 	return useQuery<Adt[], Error>({
// 		queryKey: ['Adt'],
// 		queryFn: fetchAttendance,
// 		initialData: [],
// 	});
// };


// ------------------------------------ 근태현황 -------------------------------------------------- //
// 근무 시간 조회
const fetchAttendanceHour = async (params: any): Promise<AttendanceHour[]> => {
	const { data } = await axiosInstance.get(`/wrk/dbhwrkabs/wrktimecntr100?emplNo=${params.emplNo}&emplNameHan=${params.emplNameHan}&baseMonth=${params.baseMonth}`);
	return data;
};
export const useAttendanceHour = (params: any) => {
	return useQuery<AttendanceHour[], Error>({
		queryKey: ['AttendanceHour', params],
		queryFn: () => fetchAttendanceHour(params),
		initialData: [],
		enabled: !!params.emplNo && !!params.emplNameHan && !!params.baseMonth,
	});
};
// 근무 시간 조회(부재소명)
const fetchAttendanceHourDetail = async (params: any): Promise<AttendanceHourDetail[]> => {
	const { data } = await axiosInstance.get(`/wrk/dbhwrkabs/wrkabsstat100?${params}`);
	return data;
};
export const useAttendanceHourDetail = (qs: any) => {
	return useQuery<AttendanceHourDetail[], Error>({
		queryKey: ['AttendanceHourDetail', ''],
		queryFn: () => fetchAttendanceHourDetail(qs),
		initialData: [],
	});
};
// 근무 스케쥴 조회
const fetchAttendanceSchedule = async (params: any): Promise<AttendanceSchedule[]> => {
	const { data } = await axiosInstance.get(`/wrk/dbhwrkleav/wrkworkplanemp140?searchEmplNo=${params.searchEmplNo}&searchEmplNameHan=${params.searchEmplNameHan}&baseMonth=${params.baseMonth}`);
	return data;
};
export const useAttendanceSchedule = (params: any) => {
	return useQuery<AttendanceSchedule[], Error>({
		queryKey: ['AttendanceSchedule', params],
		queryFn: () => fetchAttendanceSchedule(params),
		initialData: [],
	});
};
// 팀원 근무 스케쥴 조회
const fetchAttendanceScheduleMember = async (params: any): Promise<AttendanceScheduleMember[]> => {
	const { data } = await axiosInstance.get(`/wrk/wrkleav/wrkcalendar130?searchOrgCode=${params.searchOrgCode}&searchOrgNameHan=${params.searchOrgNameHan}&baseMonth=2024-11`);
	return data;
};
export const useAttendanceScheduleMember = (params: any) => {
	return useQuery<AttendanceScheduleMember[], Error>({
		queryKey: ['AttendanceScheduleMember', params],
		queryFn: () => fetchAttendanceScheduleMember(params),
		initialData: [],
		enabled: !!params.searchOrgCode && !!params.searchOrgNameHan,
	});
};









// ------------------------------------ 근태신청 -------------------------------------------------- //
// 근태 취소 조회
const fetchAttendanceCancel = async (params: any, user: any): Promise<AdtCancel[]> => {
	const { data } = await axiosInstance.get(`/wrk/dbhabsappr/apprattc100-pop?fromDate=${params.fromDate}&toDate=${params.toDate}&emplNo=${user}`);
  // console.log(data);
	return data;
};
export const useAttendanceCancel = (params: any, user: any) => {
	return useQuery<AdtCancel[], Error>({
		queryKey: ['AdtCancel', params, user],
		queryFn: () => fetchAttendanceCancel(params, user),
		initialData: [],
	});
};


// 선택근무 계획 수립
const fetchAttendanceChoosePlan = async (params: any): Promise<AttendanceChoosePlan> => {
	const { data } = await axiosInstance.get(`/wrk/dbhdocappr/apprflex200/getbaseinfo?emplNo=${params.emplNo}&workYymm=${params.workYymm}`);
	return data;
};
export const useAttendanceChoosePlan = (params: any) => {
	return useQuery<AttendanceChoosePlan, Error>({
		queryKey: ['AttendanceChoosePlan', params],
		queryFn: () => fetchAttendanceChoosePlan(params),
		initialData: Object,
		enabled: !!params.emplNo && !!params.workYymm,
	});
};


// 출/퇴근 기록 변경신청
const fetchAttendanceHistory = async (params: any): Promise<AttendanceHistory[]> => {
	const { data } = await axiosInstance.get(`/uhr/docappr/apprtm-pop?emplNo=${params.emplNo}&baseMonth=${params.baseMonth}`);
	return data;
};
export const useAttendanceHistory = (params: any) => {
	return useQuery<AttendanceHistory[], Error>({
		queryKey: ['AttendanceHistory', params],
		queryFn: () => fetchAttendanceHistory(params),
		initialData: [],
		enabled: !!params.emplNo && !!params.baseMonth
	});
};


// 초과근무 당일 - 업무구분
const fetchAttendanceOverTime = async (params: any): Promise<AttendanceOverTime[]> => {
	const { data } = await axiosInstance.get(`/uhr/docappr/approvtm200/findWorkCode?emplNo=${params.emplNo}&workDate=${params.workDate}`);
	return data;
};
export const useAttendanceOverTime = (params: any) => {
	return useQuery<AttendanceOverTime[], Error>({
		queryKey: ['AttendanceOverTime', params],
		queryFn: () => fetchAttendanceOverTime(params),
		initialData: [],
		enabled: !!params.emplNo,
	});
};
// 초과근무 취소 조회
const fetchAttendanceOverTimeCancel = async (params: any): Promise<AttendanceOverTimeCancel[]> => {
	const { data } = await axiosInstance.get(`/uhr/docappr/apprcnclovtm-pop?fromDate=${params.fromDate}&toDate=${params.toDate}`);
  // console.log(data);
	return data;
};
export const useAttendanceOverTimeCancel = (params: any) => {
	return useQuery<AttendanceOverTimeCancel[], Error>({
		queryKey: ['AttendanceOverTimeCancel', params],
		queryFn: () => fetchAttendanceOverTimeCancel(params),
		initialData: [],
	});
};



// ------------------------------------ 교대조신청 -------------------------------------------------- //
// 근무조 변경 신청
const fetchAttendanceShift = async (params: any): Promise<AttendanceShift[]> => {
	const { data } = await axiosInstance.get(`/wrk/dbhshft/wrksh800/shftrule?workDate=${params.workDate}&emplNo=${params.emplNo}`);
	return data.dateShftInfo;
};
export const useAttendanceShift = (params: any) => {
	return useQuery<AttendanceShift[], Error>({
		queryKey: ['AttendanceShift', params],
		queryFn: () => fetchAttendanceShift(params),
		initialData: [],
		enabled: !!params.workDate && !!params.emplNo
	});
};
// 근무조 (재량근무자 체크)
const fetchAttendanceShiftType = async (params: any): Promise<AttendanceShiftType> => {
	const { data } = await axiosInstance.get(`/main/main/getWorkType?loginUserId=${params.loginUserId}`);
	return data;
};
export const useAttendanceShiftType = (params: any) => {
	return useQuery<AttendanceShiftType, Error>({
		queryKey: ['AttendanceShiftType', params],
		queryFn: () => fetchAttendanceShiftType(params),
		initialData: Object,
		enabled: !!params.loginUserId
	});
};


// ------------------------------------ ~ 12/23 -------------------------------------------------- //
// 부재시간관리
const fetchAbsence = async (params: any): Promise<Absence[]> => {
	const { data } = await axiosInstance.get(`/wrk/dbhwrkabs/wrktimecntr100?baseMonth=${params.baseMonth}&orgCode=${params.orgCode}&orgNameHan${params.orgNameHan}&emplNo=&emplNameHan=&downInd=`);
	return data;
};
export const useAttendanceAbsence = (params: any) => {
	return useQuery<Absence[], Error>({
		queryKey: ['Absence', params],
		queryFn: () => fetchAbsence(params),
		initialData: [],
	});
};

// 부재시간 소명 리스트
const fetchAbsenceDetail = async (params: any): Promise<AbsenceDetail[]> => {
	const { data } = await axiosInstance.get(`/wrk/dbhwrkabs/wrkabsstat100?${params}`);
	return data;
};
export const useAttendanceAbsenceDetail = (qs: any) => {
	return useQuery<AbsenceDetail[], Error>({
		queryKey: ['AbsenceDetail', ''],
		queryFn: () => fetchAbsenceDetail(qs),
		initialData: [],
	});
};






// ------------------------------------ 근태 관련 -------------------------------------------------- //
// 잔여연차
const fetchAttendanceRemain = async (params: any): Promise<AttendanceRemain> => {
	const { data } = await axiosInstance.get(`wrk/dbhabsappr/apprattd100/chkRemainDaysByEmplNo?
		emplNo=${params.emplNo}&emplNameHan=${params.emplNameHan}&orgNameHan=${params.orgNameHan}&positionNameHan=${params.positionNameHan}&titleNameHan=${params.titleNameHan}&startDate=${params.startDate}&endDate=${params.endDate}&startHour=${params.startHour}&startMin=${params.startMin}&endHour=${params.endHour}&endMin=${params.endMin}&cncDay=${params.cncDay}&reqEmplNo=${params.reqEmplNo}&reqEmplName=${params.reqEmplName}&entranceDate=${params.entranceDate}
	`);
	return data;
};
export const useAttendanceRemain = (params: any) => {
	return useQuery<AttendanceRemain, Error>({
		queryKey: ['AttendanceRemain', params],
		queryFn: () => fetchAttendanceRemain(params),
		initialData: Object,
	});
};

// 근태종류
const fetchAttendanceKind = async (): Promise<AttendanceKind[]> => {
	const { data } = await axiosInstance.get(`/wrk/dbhabsappr/apprattd100/workcodekind`);
	return data;
};
export const useAttendanceKind = () => {
	return useQuery<AttendanceKind[], Error>({
		queryKey: ['AttendanceKind'],
		queryFn: fetchAttendanceKind,
		initialData: [],
	});
};


// 근태종류 - 경조사
const fetchAttendanceEvent = async (): Promise<AttendanceEvent[]> => {
	const { data } = await axiosInstance.get(`/wrk/dbhabsappr/apprattd100/cncCode`);
	return data;
};
export const useAttendanceEvent = () => {
	return useQuery<AttendanceEvent[], Error>({
		queryKey: ['AttendanceEvent'],
		queryFn: fetchAttendanceEvent,
		initialData: [],
	});
};
// 근태종류 - 경조사 - 임신기간
const fetchAttendanceEventGA = async (): Promise<AttendancePeriod[]> => {
	const { data } = await axiosInstance.get(`/wrk/dbhabsappr/apprattd100/cncCode`);
	return data;
};
export const useAttendanceEventGA = () => {
	return useQuery<AttendancePeriod[], Error>({
		queryKey: ['AttendanceEventGA'],
		queryFn: fetchAttendanceEventGA,
		initialData: [],
	});
};


// 휴/복직 구분
const fetchAttendanceSwitch = async (params: any): Promise<AttendanceSwitch[]> => {
	const { data } = await axiosInstance.get(`/wrk/dbhabsappr/apprstopemp100/stopCd?baseDate=${params.baseDate}&workCode=${params.workCode}`);
	return data;
};
export const useAttendanceSwitch = (params: any) => {
	return useQuery<AttendanceSwitch[], Error>({
		queryKey: ['AttendanceSwitch', params],
		queryFn: () => fetchAttendanceSwitch(params),
		initialData: [],
	});
};


// 근태신청 현황
const fetchAttendanceForm = async (params: any): Promise<AttendanceForm[]> => {
	const { data } = await axiosInstance.get(`/empmenu/docappr/docapprdocmstremp110/form?reqDateFrom=${params.reqDateFrom}&reqDateTo=${params.reqDateTo}&formId=${params.formId}&statusCode=${params.statusCode}&searchEmplNo=${params.searchEmplNo}`);
	return data;
};
export const useAttendanceForm = (params: any) => {
	return useQuery<AttendanceForm[], Error>({
		queryKey: ['AttendanceForm', params],
		queryFn: () => fetchAttendanceForm(params),
		initialData: [],
		enabled: !!params.searchEmplNo
	});
};
const fetchAttendanceList = async (params: any): Promise<AttendanceList[]> => {
	const { data } = await axiosInstance.get(`/empmenu/docappr/docapprdocmstremp110?reqDateFrom=${params.reqDateFrom}&reqDateTo=${params.reqDateTo}&formId=${params.formId}&statusCode=${params.statusCode}&searchEmplNo=${params.searchEmplNo}`);
	return data;
};
export const useAttendanceList = (params: any) => {
	return useQuery<AttendanceList[], Error>({
		queryKey: ['AttendanceList', params],
		queryFn: () => fetchAttendanceList(params),
		initialData: [],
		enabled: !!params.searchEmplNo
	});
};