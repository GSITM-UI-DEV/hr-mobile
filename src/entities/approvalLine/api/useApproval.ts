import { axiosInstance } from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ApprovalForm, ApprovalLine } from "..";


const fetchApprovalForm = async (): Promise<ApprovalForm[]> => {
	const { data } = await axiosInstance.get(`/system/aprvlineset/form`);
	return data;
};
export const useApprovalForm = () => {
	return useQuery<ApprovalForm[], Error>({
		queryKey: ['ApprovalForm'],
		queryFn: fetchApprovalForm,
		initialData: [],
	});
};

const fetchApprovalLine = async (params: any): Promise<ApprovalLine[]> => {
	const { data } = await axiosInstance.get(`/system/aprvlineset/default?formId=${params.formId}&emplNo=${params.emplNo}&recvEmplNo=${params.recvEmplNo}&ccCode=${params.ccCode}&cncCode=${params.cncCode}`);
	return data;
};
export const useApprovalLine = (params: any) => {
	return useQuery<ApprovalLine[], Error>({
		queryKey: ['ApprovalLine', params],
		queryFn: () => fetchApprovalLine(params),
		initialData: [],
		enabled: !!params.formId && !!params.emplNo,
	});
};

const fetchApprovalDocument = async (user: string): Promise<string> => {
	const { data } = await axiosInstance.get(`/wrk/dbhabsappr/apprattc100/docno?reqEmplNo=${user}`);
	return data;
};
export const useApprovalDocument = (user: string) => {
	return useQuery<string, Error>({
		queryKey: ['ApprovalDocument', user],
		queryFn: () => fetchApprovalDocument(user),
		initialData: '',
		enabled: !!user,
	});
};


// 코드
const fetchBaseCode = async (params: any): Promise<[]> => {
	const { data } = await axiosInstance.post(`/api/setbasecode`, params);
	return data;
};
export const useBaseCode = (params: any) => {
	return useQuery<[], Error>({
		queryKey: ['BaseCode', params],
		queryFn: () => fetchBaseCode(params),
		initialData: [],
		enabled: !!params,
	});
};

// 코드
const fetchWorkCode = async (): Promise<[]> => {
	const { data } = await axiosInstance.get(`/wrk/dbhabsappr/apprattc100/workcodekind`);
	return data;
};
export const useWorkCode = () => {
	return useQuery<[], Error>({
		queryKey: ['WorkCode'],
		queryFn: () => fetchWorkCode(),
		initialData: [],
	});
};