import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { SalaryDetail, SalaryDeduct, Salary, SalarySeverance, SalarySeveranceReckon } from "..";


// 급여명세서 조회
const fetchSalary = async (params: any): Promise<Salary[]> => {
	const { data } = await axiosInstance.get(`/pay/payself/payself110?baseYear=${params.baseYear}&emplNo=${params.emplNo}&emplNameHan=${params.emplNameHan}&payGroupCode=`);
	return data;
};
export const useSalary = (params: any) => {
	return useQuery<Salary[], Error>({
		queryKey: ['Salary'],
		queryFn: () => fetchSalary(params),
		initialData: [],
		enabled: !!params.emplNo && !!params.emplNameHan
	});
};

// 급여명세서 지급내역 조회
const fetchSalaryDetail = async (params: any): Promise<SalaryDetail[]> => {
	const { data } = await axiosInstance.get(`/pay/payself/payself110/income?payDate=${params.payDate}&emplNo=${params.emplNo}&paySeqNo=${params.paySeqNo}`);
	return data;
};
export const useSalaryDetail = (params: any) => {
	return useQuery<SalaryDetail[], Error>({
		queryKey: ['SalaryDetail', params],
		queryFn: () => fetchSalaryDetail(params),
		initialData: [],
		enabled: !!params.payDate && !!params.emplNo
	});
};

// 급여명세서 공제내역 조회
const fetchSalaryDeduct = async (params: any): Promise<SalaryDeduct[]> => {
	const { data } = await axiosInstance.get(`/pay/payself/payself110/ded?payDate=${params.payDate}&emplNo=${params.emplNo}&paySeqNo=${params.paySeqNo}`);
	return data;
};
export const useSalaryDeduct = (params: any) => {
	return useQuery<SalaryDeduct[], Error>({
		queryKey: ['SalaryDeduct', params],
		queryFn: () => fetchSalaryDeduct(params),
		initialData: [],
		enabled: !!params.payDate && !!params.emplNo
	});
};





// // 사용자 퇴직기산일 세팅
// const fetchSalarySeveranceReckon = async (params: any): Promise<SalarySeveranceReckon> => {
// 	const { data } = await axiosInstance.get(`/pay/payrpnsn/payrpnsn271?orgCode=&orgNameHan=&emplNameHan=&emplNo=${params.emplNo}`);
// 	return data;
// };
// export const useSalarySeveranceReckon = (params: any) => {
// 	return useQuery<SalarySeveranceReckon, Error>({
// 		queryKey: ['SalarySeveranceReckon', params],
// 		queryFn: () => fetchSalarySeveranceReckon(params),
// 		initialData: Object,
// 		enabled: !!params.emplNo
// 	});
// };

// 사용자정보 받아서 보험종류에 따라 분기
const fetchSalarySeveranceReckon = async (params: any): Promise<string> => {
	const { data } = await axiosInstance.get(`/pay/payrpnsn/payrpnsn270/getAnnuityType?emplNo=${params.emplNo}`);
	return data;
};
export const useSalarySeveranceReckon = (params: any) => {
	return useQuery<string, Error>({
		queryKey: ['SalarySeveranceReckon', params],
		queryFn: () => fetchSalarySeveranceReckon(params),
		initialData: Object,
		enabled: !!params.emplNo
	});
};

// 예상퇴직금 조회
const fetchSalarySeverance = async (params: any): Promise<SalarySeverance> => {
	const { data } = await axiosInstance.get(`/pay/payrpnsn/payrpnsn270/search?emplNo=${params.emplNo}`);
	return data;
};
export const useSalarySeverance = (params: any) => {
	return useQuery<SalarySeverance, Error>({
		queryKey: ['SalarySeverance', params],
		queryFn: () => fetchSalarySeverance(params),
		initialData: Object,
		// enabled: !!params.orgCode && !!params.orgNameHan && !!params.emplNameHan && !!params.emplNo
		enabled: !!params.emplNo
	});
};

// // 예상퇴직금 조회
// const fetchSalarySeverance = async (params: any): Promise<SalarySeverance> => {
// 	const { data } = await axiosInstance.get(`/pay/payrpnsn/payrpnsn271/calc?basisDateRetire=${params.basisDateRetire}&retireDateReckon=${params.retireDateReckon}&emplNo=${params.emplNo}`);
// 	return data;
// };
// export const useSalarySeverance = (params: any) => {
// 	return useQuery<SalarySeverance, Error>({
// 		queryKey: ['SalaryDeduct', params],
// 		queryFn: () => fetchSalarySeverance(params),
// 		initialData: Object,
// 		enabled: !!params.emplNo && !!params.basisDateRetire && !!params.retireDateReckon
// 	});
// };