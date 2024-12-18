import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ComplaintField, ComplaintKind, ComplaintList } from "..";

// 행정서비스 신청 조회
const fetchComplaintList = async (params: any): Promise<ComplaintList[]> => {
	const { data } = await axiosInstance.get(`/wlf/welfaremng/welfaremng110?fromDate=${params.fromDate}&toDate=${params.toDate}`);
	return data;
};
export const useComplaintList = (params: any) => {
	return useQuery<ComplaintList[], Error>({
		queryKey: ['ComplaintList', params],
		queryFn: () => fetchComplaintList(params),
		initialData: []
	});
};


//  행정서비스 신청 항목 조회
const fetchComplaintKind = async (): Promise<ComplaintKind[]> => {
	const { data } = await axiosInstance.get(`/wlf/welfaremng/welfaremng110/getwelfare`);
	return data;
};
export const useComplaintKind = () => {
	return useQuery<ComplaintKind[], Error>({
		queryKey: ['ComplaintKind'],
		queryFn: fetchComplaintKind,
		initialData: []
	});
};


//  행정서비스 신청 항목에 따른 필드 세팅
const fetchComplaintField = async (params: any): Promise<ComplaintField[]> => {
	const { data } = await axiosInstance.get(`/wlf/welfaremng/welfaremng110/getdetail?wfCode=${params}`);
	return data;
};
export const useComplaintField = (params: any) => {
	return useQuery<ComplaintField[], Error>({
		queryKey: ['ComplaintKind', params],
		queryFn: () => fetchComplaintField(params),
		initialData: [],
		enabled: !!params
	});
};