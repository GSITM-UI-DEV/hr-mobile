import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { WelfareFund, WelfareInsurance, WelfareStatus, WelfareStudentLoan } from "..";


// 복리후생 전체 조회
const fetchWelfare = async (params: any): Promise<WelfareStatus[]> => {
	const { data } = await axiosInstance.get(`/wlf/welfaremng/welfaremng100/findwelfaremobile?emplNo=${params.emplNo}&yyyyMm=${params.yyyyMm}&loginCoId=${params.loginCoId}`);
	return data;
};
export const useWelfare = (params: any) => {
	return useQuery<WelfareStatus[], Error>({
		queryKey: ['WelfareStatus', params],
		queryFn: () => fetchWelfare(params),
		initialData: [],
		enabled: !!params.emplNo && !!params.yyyyMm && !!params.loginCoId
	});
};


// 경조사 계좌 세팅
const fetchFundBank = async (params: any): Promise<WelfareFund> => {
	const { data } = await axiosInstance.get(`/uhr/docappr/apprcn600/userInfo?coCode=${params.coCode}&emplNo=${params.emplNo}`);
	return data;
};
export const useFundBank = (params: any) => {
	return useQuery<WelfareFund, Error>({
		queryKey: ['fetchFundBank', params],
		queryFn: () => fetchFundBank(params),
		initialData: Object,
		enabled: !!params.coCode && !!params.emplNo
	});
};
// 경조사 문서번호 세팅




// 학자금 신청 자녀 조회
const fetchStudentLoan = async (): Promise<WelfareStudentLoan[]> => {
	const { data } = await axiosInstance.get("/wlf/wlfstuapply/wlfstuapply111/findPsfmly");
	return data;
};
export const useStudentLoan = () => {
	return useQuery<WelfareStudentLoan[], Error>({
		queryKey: ['fetchStudentLoan'],
		queryFn: fetchStudentLoan,
		initialData: [],
	});
};


// 상해보험 신청
const fetchInsurance = async (): Promise<WelfareInsurance[]> => {
	const { data } = await axiosInstance.get("/wlf/wlfinsurance/wlfinsurance100/setins");
	return data;
};
export const useInsurance = () => {
	return useQuery<WelfareInsurance[], Error>({
		queryKey: ['fetchInsurance'],
		queryFn: fetchInsurance,
		initialData: [],
	});
};