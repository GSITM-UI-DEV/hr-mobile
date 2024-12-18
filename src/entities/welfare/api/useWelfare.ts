import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { WelfareFund, WelfareInsurance, WelfareStatus, WelfareStudentLoan } from "..";


// 복리후생 전체 조회
const fetchWelfare = async (): Promise<WelfareStatus[]> => {
	const { data } = await axiosInstance.get("/wlf/welfaremng/welfaremng200?emplNo=10006254&yyMM=202410");
	return data;
};
export const useWelfare = () => {
	return useQuery<WelfareStatus[], Error>({
		queryKey: ['WelfareStatus'],
		queryFn: fetchWelfare,
		initialData: [],
	});
};


// 경조사 계좌 세팅
const fetchFundBank = async (user: any): Promise<WelfareFund[]> => {
	const { data } = await axiosInstance.get(`/uhr/docappr/apprcn600/userInfo?coCode=1000&emplNo=${user}`);
	return data;
};
export const useFundBank = (user: any) => {
	return useQuery<WelfareFund[], Error>({
		queryKey: ['fetchFundBank'],
		queryFn: () => fetchFundBank(user),
		initialData: [],
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