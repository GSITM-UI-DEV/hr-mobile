import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { TenureLeaveDetail, TenureLeaveFlow, TenureLeaveSurvey } from "..";



// 퇴직Flow처리
const fetchTenureLeaveFlow = async (params: any): Promise<TenureLeaveFlow[]> => {
	const { data } = await axiosInstance.get(`/emp/dbhemprt/emprt140?fromDate=${params.fromDate}&toDate=${params.toDate}&rEmplNo=${params.rEmplNo}&rEmplNameHan=${params.rEmplNameHan}&sComplYn=${params.sComplYn}&role=${params.role}`);
	return data;
};
export const useTenureLeaveFlow = (params: any) => {
	return useQuery<TenureLeaveFlow[], Error>({
		queryKey: ['TenureLeaveFlow', params],
		queryFn: () => fetchTenureLeaveFlow(params),
		initialData: [],
		enabled: !!params.fromDate && !!params.rEmplNo && !!params.rEmplNameHan
	});
};

// 퇴직Flow처리
const fetchTenureLeaveDetail = async (params: any): Promise<TenureLeaveDetail[]> => {
	const { data } = await axiosInstance.get(`/emp/dbhemprt/emprt140/getdetail?${params}`);
	return data;
};
export const useTenureLeaveDetail = (params: any) => {
	return useQuery<TenureLeaveDetail[], Error>({
		queryKey: ['TenureLeaveDetail', params],
		queryFn: () => fetchTenureLeaveDetail(params),
		initialData: [],
		enabled: !!params
	});
};

// 퇴직Flow처리
const fetchTenureLeaveSurvey = async (params: any): Promise<TenureLeaveSurvey[]> => {
	const { data } = await axiosInstance.get(`/emp/dbhemprt/emprt140/pop01?emplNo=${params.emplNo}&retireReqDate=${params.retireReqDate}&rtflowId=${params.rtflowId}`);
	return data;
};
export const useTenureLeaveSurvey = (params: any) => {
	return useQuery<TenureLeaveSurvey[], Error>({
		queryKey: ['TenureLeaveSurvey', params],
		queryFn: () => fetchTenureLeaveSurvey(params),
		initialData: [],
		enabled: !!params.emplNo && !! params.retireReqDate && !!params.rtflowId
	});
};