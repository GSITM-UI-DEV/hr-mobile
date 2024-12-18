import { axiosInstance } from "@/app/api/axiosInstance";
import { WelfareFund, WelfareInsurance, WelfareStudentLoan } from "../model/types";
import { useQuery } from "@tanstack/react-query";



// 경조사 신청
const createFund = async (): Promise<WelfareFund> => {
	const { data } = await axiosInstance.post("/uhr/docappr/apprcn600/req",
		{},
	);
	return data;
};
export const applyFund = () => {
	return useQuery<WelfareFund, Error>({
		queryKey: ['WelfareFund'],
		queryFn: createFund,
		initialData: Object,
	});
};



// 학자금 신청
const createStudentLoan = async (): Promise<WelfareStudentLoan> => {
	const { data } = await axiosInstance.post("/wlf/wlfstuapply/wlfstuapply111/req",
		{},
	);
	return data;
};
export const applyStudentLoan = () => {
	return useQuery<WelfareStudentLoan, Error>({
		queryKey: ['welfareStudentLoan'],
		queryFn: createStudentLoan,
		initialData: Object,
	});
};



// 보험 신청
const createInsurance = async (): Promise<WelfareInsurance> => {
	const { data } = await axiosInstance.post("/wlf/wlfinsurance/wlfinsurance100/req",
		{},
	);
	return data;
};
export const applyInsurance = () => {
	return useQuery<WelfareInsurance, Error>({
		queryKey: ['WelfareInsurance'],
		queryFn: createInsurance,
		initialData: Object,
	});
};